# MisplaceAI/process_misplaced_manager/utils.py

from django.utils import timezone
from .models import DailyDetectionLimit, DetectionLimitSetting

def check_daily_limit(user, detection_type):
    limit_setting = DetectionLimitSetting.objects.first()
    if not limit_setting:
        limit_setting = DetectionLimitSetting.objects.create(daily_image_limit=10, daily_video_limit=5)
    
    detection_limit, created = DailyDetectionLimit.objects.get_or_create(user=user)
    detection_limit.reset_limits()  # Ensure limits are reset if the day has changed
    
    if detection_type == 'image':
        if detection_limit.image_detection_count >= limit_setting.daily_image_limit:
            return False, limit_setting.daily_image_limit - detection_limit.image_detection_count
    elif detection_type == 'video':
        if detection_limit.video_detection_count >= limit_setting.daily_video_limit:
            return False, limit_setting.daily_video_limit - detection_limit.video_detection_count
    return True, limit_setting.daily_image_limit - detection_limit.image_detection_count if detection_type == 'image' else limit_setting.daily_video_limit - detection_limit.video_detection_count

def increment_detection_count(user, detection_type):
    detection_limit = DailyDetectionLimit.objects.get(user=user)
    if detection_type == 'image':
        detection_limit.image_detection_count += 1
    elif detection_type == 'video':
        detection_limit.video_detection_count += 1
    detection_limit.save()
