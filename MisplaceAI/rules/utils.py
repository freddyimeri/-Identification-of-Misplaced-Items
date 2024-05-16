from django.core.exceptions import ValidationError
from .models import Rule

def validate_rule(rule):
    """
    Validates a rule to ensure there are no conflicting rules.
    """
    existing_rules = Rule.objects.filter(item=rule.item).exclude(id=rule.id)
    for existing_rule in existing_rules:
        if set(existing_rule.locations.all()) & set(rule.locations.all()):
            raise ValidationError(f"A rule for {rule.item.name} already exists for one or more of the selected locations.")
    
def check_item_location(item, location):
    """
    Checks if the given item is allowed at the given location based on the existing rules.
    """
    rules = Rule.objects.filter(item=item, locations=location)
    if not rules.exists():
        return False
    return True

def get_item_location_rules(item):
    """
    Retrieves all the locations where the given item is allowed based on the existing rules.
    """
    rules = Rule.objects.filter(item=item)
    allowed_locations = set()
    for rule in rules:
        allowed_locations.update(rule.locations.all())
    return allowed_locations

def notify_user_of_misplacement(user, item, location):
    """
    Notifies the user that the given item is misplaced at the given location.
    """
    # This function can be implemented to send notifications to the user.
    # For now, we will just print a message.
    print(f"User {user.username}, the item '{item.name}' is misplaced at '{location.name}'.")
