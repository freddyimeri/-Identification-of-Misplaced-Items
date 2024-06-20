# MisplaceAi/placement_rules/utils.py

from rules.models import Rule

class PlacementRules:
    def __init__(self):
        # Initialize the PlacementRules object and load rules from the database
        self.rules = self.load_rules_from_db()

    def load_rules_from_db(self):
        """Load rules from the database and store them in a dictionary."""
        rules_dict = {}
        # Retrieve all Rule objects from the database
        rules = Rule.objects.all()
        for rule in rules:
            # Extract the name of the item associated with the rule
            item_name = rule.item.name
            # Extract the list of allowed locations for this item
            allowed_locations = list(rule.locations.values_list('name', flat=True))
            # Store the item name and its allowed locations in the dictionary
            rules_dict[item_name] = allowed_locations
        return rules_dict

    def check_placement(self, dataLocation):
        """Check the placement of each object based on the rules.
        
        Args:
            dataLocation (list): A list of dictionaries, each representing an object's data.
        
        Returns:
            list: A list of misplaced objects with their allowed locations.
        """
        misplaced_objects = []
        print("-----------------------------------")
        print("--CHECK-PLACEMENT-FOR-EACH-OBJECT--")
        
        # Iterate over each object in the dataLocation list
        for obj in dataLocation:
            object_name = obj["class_name"]
            # Retrieve the allowed locations for the current object from the rules dictionary
            allowed_locations = self.rules.get(object_name, [])
            is_placed_correctly = False
            print(f"Checking {object_name}, allowed on: {allowed_locations}")

            # Check if the object is correctly placed in any of the allowed locations
            for location in allowed_locations:
                is_on_top, _ = self.is_on_top_of(dataLocation, object_name, location)
                if is_on_top:
                    is_placed_correctly = True
                    break

            # If the object is not placed correctly and there are allowed locations, it is misplaced
            if not is_placed_correctly and allowed_locations:
                print(f"{object_name} is misplaced. It should be on {', '.join(allowed_locations)}.")
                # Add the allowed locations to the object for reference
                obj["allowed_locations"] = allowed_locations
                # Add the misplaced object to the list
                misplaced_objects.append(obj)
        print("-----------------------------------")
        return misplaced_objects

    def is_on_top_of(self, dataLocation, top_object_name, bottom_object_name):
        """Check if any object of top_object_name is on top of any object of bottom_object_name.
        
        Args:
            dataLocation (list): A list of dictionaries, each representing an object's data.
            top_object_name (str): The class name of the object to be checked if on top.
            bottom_object_name (str): The class name of the object to be checked if below.
        
        Returns:
            tuple: A boolean indicating if the top object is on top of the bottom object, and a message.
        """
        # Filter objects by their class name
        top_objects = [obj for obj in dataLocation if obj["class_name"] == top_object_name]
        bottom_objects = [obj for obj in dataLocation if obj["class_name"] == bottom_object_name]

        # Define a function to check if two objects have horizontal overlap
        def has_horizontal_overlap(a, b):
            """
            Check if two objects have horizontal overlap based on their bounding box coordinates.

            Args:
                a (dict): Dictionary containing bounding box coordinates of the first object.
                b (dict): Dictionary containing bounding box coordinates of the second object.

            Returns:
                bool: True if there is horizontal overlap, False otherwise.
            """
            # 'xmax' is the right edge and 'xmin' is the left edge of the bounding box.
            # Check if there is no horizontal overlap:
            # 1. a["xmax"] <= b["xmin"]: True if the right edge of 'a' is to the left of or exactly at the left edge of 'b'
            # 2. a["xmin"] >= b["xmax"]: True if the left edge of 'a' is to the right of or exactly at the right edge of 'b'
            # If either of the above conditions is true, there is no overlap.
            # 'not' inverts this to check for overlap instead.
            return not (a["xmax"] <= b["xmin"] or a["xmin"] >= b["xmax"])


        # Check if any top object is on top of any bottom object
        for top in top_objects:
            for bottom in bottom_objects:
                # Check if the top and bottom objects have horizontal overlap
                if has_horizontal_overlap(top, bottom):
                    # Check if the top object's ymax is within the y-range of the bottom object
                    if top["ymax"] <= bottom["ymax"] and top["ymax"] >= bottom["ymin"]:
                        # Return True if the top object is found on top of the bottom object
                        return (
                            True,
                            f"Object {top['Object']} ({top['class_name']}) is on top of Object {bottom['Object']} ({bottom['class_name']})",
                        )

        # Return False if no top object is found on top of a bottom object
        return False, f"No {top_object_name} is on top of any {bottom_object_name}."
