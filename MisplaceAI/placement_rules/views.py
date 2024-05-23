from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from placement_rules.utils import PlacementRules
import json
from django.shortcuts import render

@csrf_exempt
def check_placement(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        placement_rules = PlacementRules()
        misplaced_items = placement_rules.check_placement(data)
        return JsonResponse({'misplaced_items': misplaced_items})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def live_detection(request):
    return render(request, 'process_misplaced_manager/live_detection.html')




####################################################################