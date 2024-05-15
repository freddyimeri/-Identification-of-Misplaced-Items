from .models import Rule

class RulesManager:
    def __init__(self):
        self.rules = self.load_rules()

    def load_rules(self):
        """Load the rules from the database."""
        return {rule.name: {'condition': rule.condition, 'action': rule.action} for rule in Rule.objects.all()}

    def save_rule(self, name, condition, action):
        """Save a rule to the database."""
        rule, created = Rule.objects.update_or_create(name=name, defaults={'condition': condition, 'action': action})
        self.rules[name] = {'condition': condition, 'action': action}

    def add_rule(self, rule):
        """Add a new rule to the database."""
        self.save_rule(rule["name"], rule["condition"], rule["action"])

    def get_rule(self, rule_name):
        """Retrieve a rule by its name."""
        rule = self.rules.get(rule_name)
        if not rule:
            try:
                rule_obj = Rule.objects.get(name=rule_name)
                rule = {'condition': rule_obj.condition, 'action': rule_obj.action}
                self.rules[rule_name] = rule
            except Rule.DoesNotExist:
                return None
        return rule

    def remove_rule(self, rule_name):
        """Remove a rule by its name."""
        if rule_name in self.rules:
            del self.rules[rule_name]
            Rule.objects.filter(name=rule_name).delete()

    def list_rules(self):
        """List all rules."""
        return list(self.rules.values())
