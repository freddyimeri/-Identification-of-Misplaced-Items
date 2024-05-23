## Adding ngrok URL to Django ALLOWED_HOSTS

### Overview
When using ngrok to tunnel your local Django server, you may encounter an Invalid HTTP_HOST header error. This happens because Django’s `ALLOWED_HOSTS` setting does not include the ngrok URL. To resolve this issue, you need to add the ngrok URL to the `ALLOWED_HOSTS` setting in your Django project’s `settings.py` file.

### Steps to Fix the Issue
1. **Locate Your Django Settings File**
   First, locate your Django settings file. This file is typically named `settings.py` and can be found in your project directory. For example, it might be located at:

<your_project>/<your_project>/settings.py

### 2. Edit the ALLOWED_HOSTS Setting
   Open the `settings.py` file in your preferred text editor or IDE. Find the `ALLOWED_HOSTS` setting and add your ngrok URL to the list. If the `ALLOWED_HOSTS` list is currently empty or not defined, it will look something like this:


```bash
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'f382-164-11-203-57.ngrok-free.app',  # Add your ngrok URL here
]
```

### 3. Alternative Development Setting (Use with Caution)
For development purposes, you can allow all hosts by using a wildcard `*`. However, this is not recommended for production environments due to security risks:

```bash

ALLOWED_HOSTS = ['*']  # This allows all hosts. Use with caution.

```
