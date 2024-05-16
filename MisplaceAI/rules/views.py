from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Rule, Location, Item
from .forms import RuleForm, LocationForm, ItemForm
from django.core.paginator import Paginator

from django.urls import reverse

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
        form = RuleForm()
    return render(request, 'rules/add_rule.html', {'form': form})

def get_rule(request, rule_id):
    rule = get_object_or_404(Rule, id=rule_id)
    return render(request, 'rules/rule_detail.html', {'rule': rule})

def remove_rule(request, rule_id):
    rule = get_object_or_404(Rule, id=rule_id)
    if request.method == 'POST':
        rule.delete()
        return redirect('rules:list_rules')
    return render(request, 'rules/confirm_delete.html', {'rule': rule})

def update_rule(request, rule_id):
    rule = get_object_or_404(Rule, id=rule_id)
    if request.method == 'POST':
        form = RuleForm(request.POST, instance=rule)
        if form.is_valid():
            form.save()
            return redirect('rules:get_rule', rule_id=rule.id)
    else:
        form = RuleForm(instance=rule)
    return render(request, 'rules/update_rule.html', {'form': form, 'rule': rule})

@login_required
def admin_add_location(request):
    locations = Location.objects.all().order_by('name')
    paginator = Paginator(locations, 10)  # Show 10 locations per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.method == 'POST':
        form = LocationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Location added successfully.')
            return redirect('rules:admin_add_location')
    else:
        form = LocationForm()
    return render(request, 'rules/admin_add_location.html', {'form': form, 'page_obj': page_obj})


@login_required
def admin_add_item(request):
    items = Item.objects.all().order_by('name')
    paginator = Paginator(items, 10)  # Show 10 items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.method == 'POST':
        form = ItemForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Item added successfully.')
            return redirect('rules:admin_add_item')
    else:
        form = ItemForm()
    return render(request, 'rules/admin_add_item.html', {'form': form, 'page_obj': page_obj})



def edit_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'POST':
        form = ItemForm(request.POST, instance=item)
        if form.is_valid():
            form.save()
            return redirect('rules:admin_add_item')
    else:
        form = ItemForm(instance=item)
    return render(request, 'rules/edit_item.html', {'form': form})

def delete_item(request, item_id):
    item = get_object_or_404(Item, id=item_id)
    if request.method == 'POST':
        item.delete()
        return redirect('rules:admin_add_item')
    return render(request, 'rules/confirm_delete_item.html', {'item': item})



 

def edit_location(request, location_id):
    location = get_object_or_404(Location, id=location_id)
    if request.method == 'POST':
        form = LocationForm(request.POST, instance=location)
        if form.is_valid():
            form.save()
            # Use the 'reverse' to correctly use named URLs with namespaces
            return redirect(reverse('rules:admin_add_location'))
    else:
        form = LocationForm(instance=location)
    return render(request, 'rules/edit_location.html', {'form': form})



def delete_location(request, location_id):
    location = get_object_or_404(Location, id=location_id)
    if request.method == 'POST':
        location.delete()
        return redirect('rules:admin_add_location')
    return render(request, 'rules/confirm_delete_location.html', {'location': location})
