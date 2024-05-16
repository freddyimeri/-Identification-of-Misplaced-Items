# process_misplaced_manager/views.py

from django.shortcuts import render, redirect, get_object_or_404
from .forms import ImageUploadForm
from .models import UploadedImage

 

def display_image(request, image_id):
    image = get_object_or_404(UploadedImage, id=image_id)
    return render(request, 'process_misplaced_manager/display_image.html', {'image': image})
 
def upload_image(request):
    if request.method == 'POST':
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            new_image = UploadedImage(image=request.FILES['image'])
            new_image.save()
            return redirect('item_detector:detect_items', image_id=new_image.id)
    else:
        form = ImageUploadForm()
    return render(request, 'process_misplaced_manager/upload_image.html', {'form': form})
