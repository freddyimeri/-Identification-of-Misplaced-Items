#!/bin/bash

echo "Waiting for MySQL to be available"
max_attempts=30
count=0
while ! mysqladmin ping -h"$DATABASE_HOST" --silent; do
    count=$((count+1))
    if [ $count -ge $max_attempts ]; then
        echo "ERROR: MySQL not available after $max_attempts attempts"
        exit 1
    fi
    sleep 1
done
echo "MySQL is available and ready"

# Run Django migrations
python manage.py migrate

# Execute the command passed to this script
echo "Executing command: $@"
exec "$@"
