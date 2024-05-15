from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages

def admin_login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_superuser:
                login(request, user)
                return redirect('admin_dashboard')
            else:
                messages.error(request, 'You do not have the necessary permissions to access this page.')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'admin_app/admin_login.html')

@login_required
def admin_dashboard_view(request):
    if not request.user.is_superuser:
        return redirect('admin_login')
    return render(request, 'admin_app/admin_dashboard.html')

def admin_users_view(request):
    if not request.user.is_staff:
        return redirect('admin_login')
    
    users = User.objects.all()
    return render(request, 'admin_app/admin_users.html', {'users': users})

def admin_deactivate_user_view(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')

    user = get_object_or_404(User, id=user_id)
    user.is_active = False
    user.save()
    messages.success(request, f'User {user.username} has been deactivated.')
    return redirect('admin_users')

def admin_activate_user_view(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')

    user = get_object_or_404(User, id=user_id)
    user.is_active = True
    user.save()
    messages.success(request, f'User {user.username} has been activated.')
    return redirect('admin_users')

def admin_delete_user_view(request, user_id):
    if not request.user.is_staff:
        return redirect('admin_login')

    user = get_object_or_404(User, id=user_id)
    user.delete()
    messages.success(request, f'User {user.username} has been deleted.')
    return redirect('admin_users')
