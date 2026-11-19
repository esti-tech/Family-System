from rest_framework.response import Response
from rest_framework import status

def success_response(data=None, message="Operation completed successfully.", status_code=status.HTTP_200_OK):
    """Returns a standardized success envelope."""
    payload = {
        "success": True,
        "message": message,
    }
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)
