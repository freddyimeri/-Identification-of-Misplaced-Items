from rules.models import Rule

class PlacementRules:
    def __init__(self):
        self.rules = self.load_rules()

    def load_rules(self):
        rules = {}
        for rule in Rule.objects.all():
            item_name = rule.item.name
            if item_name not in rules:
                rules[item_name] = []
            for location in rule.locations.all():
                rules[item_name].append(location.name)
        return rules

    def check_placement(self, data_location):
        """Check the placement of each object based on the rules."""
        misplaced_objects = []
        print("-----------------------------------")
        print("--CHECK-PLACEMENT-FOR-EACH-OBJECT--")
        for obj in data_location:
            object_name = obj["class_name"]
            allowed_locations = self.rules.get(object_name, [])
            is_placed_correctly = False
            print(f"Checking {object_name}, allowed on: {allowed_locations}")

            for location in allowed_locations:
                is_on_top, _ = self.is_on_top_of(data_location, object_name, location)
                if is_on_top:
                    is_placed_correctly = True
                    break

            if not is_placed_correctly and allowed_locations:
                print(f"{object_name} is misplaced. It should be on {', '.join(allowed_locations)}.")
                obj["allowed_locations"] = allowed_locations
                misplaced_objects.append(obj)
        print("-----------------------------------")
        return misplaced_objects

    def is_on_top_of(self, data_location, top_object_name, bottom_object_name):
        # Filter objects by class_name
        top_objects = [obj for obj in data_location if obj["class_name"] == top_object_name]
        bottom_objects = [obj for obj in data_location if obj["class_name"] == bottom_object_name]

        # Define a function to check if two objects have horizontal overlap
        def has_horizontal_overlap(a, b):
            return not (a["xmax"] <= b["xmin"] or a["xmin"] >= b["xmax"])

        # Check if any of the top objects is on top of any of the bottom objects
        for top in top_objects:
            for bottom in bottom_objects:
                if has_horizontal_overlap(top, bottom):
                    if top["ymax"] <= bottom["ymax"] and top["ymax"] >= bottom["ymin"]:
                        return True, f"Object {top['Object']} ({top['class_name']}) is on top of Object {bottom['Object']} ({bottom['class_name']})"

        return False, f"No {top_object_name} is on top of any {bottom_object_name}."
