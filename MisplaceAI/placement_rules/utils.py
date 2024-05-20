from rules.models import Rule

class PlacementRules:
    def __init__(self):
        self.rules = self.load_rules_from_db()

    def load_rules_from_db(self):
        rules_dict = {}
        rules = Rule.objects.all()
        for rule in rules:
            item_name = rule.item.name
            allowed_locations = list(rule.locations.values_list('name', flat=True))
            rules_dict[item_name] = allowed_locations
        return rules_dict

    def check_placement(self, dataLocation):
        """Check the placement of each object based on the rules."""
        misplaced_objects = []
        print("-----------------------------------")
        print("--CHECK-PLACEMENT-FOR-EACH-OBJECT--")
        for obj in dataLocation:
            object_name = obj["class_name"]
            allowed_locations = self.rules.get(object_name, [])
            is_placed_correctly = False
            print(f"Checking {object_name}, allowed on: {allowed_locations}")

            for location in allowed_locations:
                is_on_top, _ = self.is_on_top_of(dataLocation, object_name, location)
                if is_on_top:
                    is_placed_correctly = True
                    break

            if not is_placed_correctly and allowed_locations:
                print(
                    f"{object_name} is misplaced. It should be on {', '.join(allowed_locations)}."
                )
                obj["allowed_locations"] = allowed_locations  # Add allowed locations to obj
                misplaced_objects.append(obj)
        print("-----------------------------------")
        return misplaced_objects

    def is_on_top_of(self, dataLocation, top_object_name, bottom_object_name):
        # Filter objects by class_name
        top_objects = [
            obj for obj in dataLocation if obj["class_name"] == top_object_name
        ]
        bottom_objects = [
            obj for obj in dataLocation if obj["class_name"] == bottom_object_name
        ]

        # Define a function to check if two objects have horizontal overlap
        def has_horizontal_overlap(a, b):
            return not (a["xmax"] <= b["xmin"] or a["xmin"] >= b["xmax"])

        # Check if any of the top objects is on top of any of the bottom objects
        for top in top_objects:
            for bottom in bottom_objects:
                if has_horizontal_overlap(top, bottom):
                    if top["ymax"] <= bottom["ymax"] and top["ymax"] >= bottom["ymin"]:
                        return (
                            True,
                            f"Object {top['Object']} ({top['class_name']}) is on top of Object {bottom['Object']} ({bottom['class_name']})",
                        )

        return False, f"No {top_object_name} is on top of any {bottom_object_name}."
