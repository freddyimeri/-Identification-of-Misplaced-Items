# misplaceAI/rules/decorators.py

from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def admin_required(view_func):
    """
    Custom decorator to ensure the user is an admin.
    """
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        return view_func(request, *args, **kwargs)
    return _wrapped_view
