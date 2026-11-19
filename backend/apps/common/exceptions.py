from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardized API Exception Handler for KinKeep.
    Ensures all errors return a predictable envelope:
    {
        "success": false,
        "error": {
            "code": "VALIDATION_ERROR" / "NOT_FOUND" / "FORBIDDEN",
            "message": "...",
            "details": {...}
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_code = 'API_ERROR'
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            error_code = 'VALIDATION_ERROR'
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            error_code = 'UNAUTHORIZED'
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            error_code = 'FORBIDDEN'
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            error_code = 'NOT_FOUND'
        elif response.status_code == status.HTTP_429_TOO_MANY_REQUESTS:
            error_code = 'RATE_LIMITED'

        # Extract message if details is a dictionary with 'detail'
        detail_msg = "An error occurred while processing your request."
        if isinstance(response.data, dict) and 'detail' in response.data:
            detail_msg = str(response.data['detail'])
        elif isinstance(response.data, dict):
            detail_msg = "Validation failed for one or more fields."
        elif isinstance(response.data, list) and response.data:
            detail_msg = str(response.data[0])

        response.data = {
            "success": False,
            "error": {
                "code": error_code,
                "message": detail_msg,
                "details": response.data if error_code == 'VALIDATION_ERROR' else None,
            }
        }

    return response
