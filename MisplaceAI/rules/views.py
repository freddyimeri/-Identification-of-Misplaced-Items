from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Rule
from .forms import RuleForm

def list_rules(request):
    rules = Rule.objects.all()
    return render(request, 'rules/list_rules.html', {'rules': rules})

def add_rule(request):
    if request.method == 'POST':
        form = RuleForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('rules:list_rules')
        else:
            return render(request, 'rules/add_rule.html', {'form': form})
    else:
        form = RuleForm()  # An unbound form for GET requests
        return render(request, 'rules/add_rule.html', {'form': form})

def get_rule(request, rule_name):
    rule = get_object_or_404(Rule, name=rule_name)
    return render(request, 'rules/rule_detail.html', {'rule': rule})

def remove_rule(request, rule_name):
    rule = get_object_or_404(Rule, name=rule_name)
    if request.method == 'POST':
        rule.delete()
        return redirect('rules:list_rules')
    return render(request, 'rules/confirm_delete.html', {'rule': rule})

def update_rule(request, rule_name):
    rule = get_object_or_404(Rule, name=rule_name)
    if request.method == 'POST':
        form = RuleForm(request.POST, instance=rule)
        if form.is_valid():
            form.save()
            return redirect('rules:get_rule', rule_name=rule.name)
        else:
            return render(request, 'rules/update_rule.html', {'form': form, 'rule': rule})
    else:
        form = RuleForm(instance=rule)
        return render(request, 'rules/update_rule.html', {'form': form, 'rule': rule})


def remove_rule(request, rule_name):
    rule = get_object_or_404(Rule, name=rule_name)
    if request.method == 'POST':
        rule.delete()
        return redirect('rules:list_rules')
    return render(request, 'rules/confirm_delete.html', {'rule': rule})
