import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from apps.accounts.models import User

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT Authentication for KinKeep.
    Extracts Bearer token from 'Authorization: Bearer <token>' or HTTP-only cookie.
    """
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        token = None

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        elif 'kinkeep_access_token' in request.COOKIES:
            token = request.COOKIES['kinkeep_access_token']

        if not token:
            return None # Fallback to permission checks (e.g. AllowAny on public endpoints)

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[getattr(settings, 'JWT_ALGORITHM', 'HS256')]
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Access token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid access token.')

        user_id = payload.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Token payload missing user_id.')

        try:
            user = User.objects.get(id=user_id, deleted_at__isnull=True)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User account not found.')

        if user.status == User.AccountStatus.SUSPENDED:
            raise exceptions.AuthenticationFailed('Account has been suspended by platform administration.')
        if user.status == User.AccountStatus.DEACTIVATED:
            raise exceptions.AuthenticationFailed('Account has been deactivated.')

        return (user, token)
