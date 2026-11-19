from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import User, UserSession, EmailVerificationToken, PasswordResetToken
from apps.accounts.services import create_user_session, rotate_refresh_token

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.refresh_url = reverse('auth-refresh')
        self.verify_url = reverse('auth-verify-email')
        self.reset_req_url = reverse('auth-reset-request')
        self.reset_confirm_url = reverse('auth-reset-confirm')
        self.me_url = reverse('auth-me')

        self.user_data = {
            "email": "solomon.bekele@example.com",
            "full_name": "Solomon Bekele",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "preferred_language": "am"
        }

    def test_user_registration_success(self):
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['data']['user']['email'], "solomon.bekele@example.com")
        self.assertTrue('demo_otp_code' in response.data['data'])

        # Check user in DB
        user = User.objects.get(email="solomon.bekele@example.com")
        self.assertEqual(user.full_name, "Solomon Bekele")
        self.assertFalse(user.is_verified)
        self.assertEqual(user.status, User.AccountStatus.PENDING)
        self.assertNotEqual(user.password, "SecurePassword123!") # Must be hashed

    def test_duplicate_email_registration_fails(self):
        self.client.post(self.register_url, self.user_data, format='json')
        # Try registering again with same email
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_email_verification_flow(self):
        reg_resp = self.client.post(self.register_url, self.user_data, format='json')
        otp_code = reg_resp.data['data']['demo_otp_code']

        verify_resp = self.client.post(self.verify_url, {"token_or_code": otp_code}, format='json')
        self.assertEqual(verify_resp.status_code, status.HTTP_200_OK)

        user = User.objects.get(email="solomon.bekele@example.com")
        self.assertTrue(user.is_verified)
        self.assertEqual(user.status, User.AccountStatus.ACTIVE)

    def test_login_and_jwt_authentication(self):
        # Create verified user
        user = User.objects.create_user(
            email="dawit@example.com",
            password="StrongPassword2026!",
            full_name="Dawit Haile",
            is_verified=True,
            status=User.AccountStatus.ACTIVE
        )

        login_resp = self.client.post(self.login_url, {
            "email": "dawit@example.com",
            "password": "StrongPassword2026!"
        }, format='json')

        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        access_token = login_resp.data['data']['access_token']
        refresh_token = login_resp.data['data']['refresh_token']
        self.assertIsNotNone(access_token)
        self.assertIsNotNone(refresh_token)

        # Access protected endpoint with Bearer token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_resp = self.client.get(self.me_url)
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(me_resp.data['data']['user']['email'], "dawit@example.com")

    def test_refresh_token_rotation_and_revocation(self):
        user = User.objects.create_user(
            email="almaz@example.com",
            password="Password123!",
            full_name="Almaz Tefera",
            status=User.AccountStatus.ACTIVE
        )
        raw_refresh, access = create_user_session(user)

        # Rotate refresh token
        rotate_resp = self.client.post(self.refresh_url, {"refresh_token": raw_refresh}, format='json')
        self.assertEqual(rotate_resp.status_code, status.HTTP_200_OK)
        new_refresh = rotate_resp.data['data']['refresh_token']
        self.assertNotEqual(raw_refresh, new_refresh)

        # Reusing the old refresh token must fail
        reuse_resp = self.client.post(self.refresh_url, {"refresh_token": raw_refresh}, format='json')
        self.assertEqual(reuse_resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_password_reset_flow(self):
        user = User.objects.create_user(
            email="mulugeta@example.com",
            password="OldPassword123!",
            full_name="Mulugeta Assefa",
            status=User.AccountStatus.ACTIVE
        )

        req_resp = self.client.post(self.reset_req_url, {"email": "mulugeta@example.com"}, format='json')
        self.assertEqual(req_resp.status_code, status.HTTP_200_OK)
        reset_token = req_resp.data['data']['demo_reset_token']

        confirm_resp = self.client.post(self.reset_confirm_url, {
            "token": reset_token,
            "new_password": "NewSecurePassword456!",
            "confirm_password": "NewSecurePassword456!"
        }, format='json')
        self.assertEqual(confirm_resp.status_code, status.HTTP_200_OK)

        # Verify login works with new password and fails with old
        fail_login = self.client.post(self.login_url, {"email": "mulugeta@example.com", "password": "OldPassword123!"})
        self.assertEqual(fail_login.status_code, status.HTTP_401_UNAUTHORIZED)

        success_login = self.client.post(self.login_url, {"email": "mulugeta@example.com", "password": "NewSecurePassword456!"})
        self.assertEqual(success_login.status_code, status.HTTP_200_OK)
