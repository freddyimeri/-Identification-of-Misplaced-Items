from .settings import *

# Database configuration for testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'misplaceai_test',
        'USER': 'user',
        'PASSWORD': 'password',
        'HOST': 'db',
        'PORT': '3306',
    }
}

# Use a faster password hasher for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Use in-memory file storage for faster tests
DEFAULT_FILE_STORAGE = 'inmemorystorage.InMemoryStorage'

# Test runner configuration
TEST_RUNNER = 'django.test.runner.DiscoverRunner'

# Disable migrations during tests
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return 'notmigrations'

MIGRATION_MODULES = DisableMigrations()

# Static files configuration for testing
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Media files configuration for testing
MEDIA_ROOT = os.path.join(BASE_DIR, 'test_media')

# Additional settings for testing
DEBUG = True
TEMPLATE_DEBUG = True

# Ensure the tests use a different cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Celery configuration for testing
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Disable Django's email backend during tests
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
