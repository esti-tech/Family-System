from rest_framework import permissions


class IsPlatformSuperAdmin(permissions.BasePermission):
    """
    Restricts access strictly to Platform Super Administrators (is_staff or is_superuser).
    Family workspace roles (Family Owner, Family Admin) NEVER grant platform administrative access.
    """
    message = "Platform Administrator authorization required."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return bool(request.user.is_staff or request.user.is_superuser)
