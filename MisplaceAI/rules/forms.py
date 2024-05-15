from django import forms
from .models import Rule

class RuleForm(forms.ModelForm):
    class Meta:
        model = Rule
        fields = ['name', 'condition', 'action']  # Include all the fields you want from the model

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if not name:
            raise forms.ValidationError("The name field cannot be left blank.")
        return name

    def clean_condition(self):
        condition = self.cleaned_data.get('condition')
        if not condition:
            raise forms.ValidationError("The condition field cannot be left blank.")
        return condition

    def clean_action(self):
        action = self.cleaned_data.get('action')
        if not action:
            raise forms.ValidationError("The action field cannot be left blank.")
        return action
