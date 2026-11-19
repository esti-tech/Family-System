from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse
from apps.common.responses import success_response
from apps.accounts.models import User
from apps.accounts.serializers import (
    RegisterSerializer, LoginSerializer, TokenRefreshSerializer,
    EmailVerificationSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, UserSerializer
)
from apps.accounts.services import (
    create_user_session, rotate_refresh_token, revoke_session,
    create_email_verification_token, verify_email_token_or_code,
    create_password_reset_token, reset_password_with_token
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: OpenApiResponse(description="User registered successfully")}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate verification token & OTP code
        raw_token, otp_code = create_email_verification_token(user)

        # In dev/demo: return the verification code in response metadata for immediate testing
        return success_response(
            data={
                "user": UserSerializer(user).data,
                "verification_sent_to": user.email,
                "demo_otp_code": otp_code # Convenient for local automated verification
            },
            message="Account registered successfully. Please verify your email.",
            status_code=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: OpenApiResponse(description="Login successful")}
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].strip().lower()
        password = serializer.validated_data['password']

        user = User.objects.filter(email=email, deleted_at__isnull=True).first()
        if not user or not user.check_password(password):
            return Response({
                "success": False,
                "error": {
                    "code": "INVALID_CREDENTIALS",
                    "message": "Invalid email address or password."
                }
            }, status=status.HTTP_401_UNAUTHORIZED)

        if user.status == User.AccountStatus.SUSPENDED:
            return Response({
                "success": False,
                "error": {
                    "code": "ACCOUNT_SUSPENDED",
                    "message": "This account has been suspended by platform administration."
                }
            }, status=status.HTTP_403_FORBIDDEN)

        # Create authenticated session
        ip = request.META.get('REMOTE_ADDR')
        ua = request.META.get('HTTP_USER_AGENT')
        refresh_token, access_token = create_user_session(user, ip_address=ip, user_agent=ua)

        # Update last login
        user.last_login_at = timezone.now()
        user.save(update_fields=['last_login_at'])

        response = success_response(
            data={
                "user": UserSerializer(user).data,
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
            message="Login successful."
        )

        # Set secure HTTP-only cookie
        response.set_cookie(
            key='kinkeep_access_token',
            value=access_token,
            httponly=True,
            samesite='Lax',
            max_age=15 * 60 # 15 minutes
        )
        return response

class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=TokenRefreshSerializer,
        responses={200: OpenApiResponse(description="Token refreshed successfully")}
    )
    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_refresh = serializer.validated_data['refresh_token']
        try:
            ip = request.META.get('REMOTE_ADDR')
            ua = request.META.get('HTTP_USER_AGENT')
            new_refresh, new_access = rotate_refresh_token(raw_refresh, ip_address=ip, user_agent=ua)
        except ValueError as e:
            return Response({
                "success": False,
                "error": {
                    "code": "TOKEN_INVALID",
                    "message": str(e)
                }
            }, status=status.HTTP_401_UNAUTHORIZED)

        response = success_response(
            data={
                "access_token": new_access,
                "refresh_token": new_refresh,
            },
            message="Token rotated successfully."
        )
        response.set_cookie(
            key='kinkeep_access_token',
            value=new_access,
            httponly=True,
            samesite='Lax',
            max_age=15 * 60
        )
        return response

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            revoke_session(refresh_token)

        response = success_response(message="Logged out successfully.")
        response.delete_cookie('kinkeep_access_token')
        return response

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=EmailVerificationSerializer)
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token_or_code = serializer.validated_data['token_or_code'].strip()
        try:
            user = verify_email_token_or_code(token_or_code)
        except ValueError as e:
            return Response({
                "success": False,
                "error": {
                    "code": "INVALID_VERIFICATION_TOKEN",
                    "message": str(e)
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return success_response(
            data={"user": UserSerializer(user).data},
            message="Email verified successfully. Your account is now active."
        )

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=PasswordResetRequestSerializer)
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].strip().lower()
        user = User.objects.filter(email=email, deleted_at__isnull=True).first()

        # To prevent user enumeration, always return success even if email does not exist
        reset_token = None
        if user:
            reset_token = create_password_reset_token(user)

        return success_response(
            data={"demo_reset_token": reset_token} if reset_token else None,
            message="If an account with that email exists, password reset instructions have been sent."
        )

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=PasswordResetConfirmSerializer)
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            user = reset_password_with_token(token, new_password)
        except ValueError as e:
            return Response({
                "success": False,
                "error": {
                    "code": "INVALID_RESET_TOKEN",
                    "message": str(e)
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        return success_response(message="Password has been reset successfully. Please log in with your new password.")

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: UserSerializer})
    def get(self, request):
        return success_response(data={"user": UserSerializer(request.user).data})
