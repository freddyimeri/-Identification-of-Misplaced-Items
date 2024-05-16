from django.shortcuts import render
from .utils import PlacementRules

def check_placement_view(request):
    if request.method == 'POST':
        # Assuming dataLocation is passed in the POST request body
        data_location = request.POST.get('dataLocation')
        placement_rules = PlacementRules()
        misplaced_objects = placement_rules.check_placement(data_location)
        return render(request, 'placement_rules/results.html', {'misplaced_objects': misplaced_objects})
    else:
        # Render a form to accept dataLocation input
        return render(request, 'placement_rules/input.html')
