from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from placement_rules.utils import PlacementRules
import json

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_placement(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        placement_rules = PlacementRules()
        misplaced_items = placement_rules.check_placement(data)
        return JsonResponse({'misplaced_items': misplaced_items})
    return JsonResponse({'error': 'Invalid request method'}, status=400)
