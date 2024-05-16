# Dockerfile
FROM python:3.10

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libblas-dev \
    liblapack-dev \
    libatlas-base-dev \
    protobuf-compiler \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install TensorFlow Object Detection API (this assumes models directory is already present)
RUN cd /app/models/research \
    && protoc object_detection/protos/*.proto --python_out=. \
    && cp object_detection/packages/tf2/setup.py . \
    && python -m pip install .

# Set PYTHONPATH
ENV PYTHONPATH=$PYTHONPATH:/app/models:/app/models/research:/app/models/research/slim

# Create the media directory
RUN mkdir -p /app/media

# Expose port 8000 for the Django app
EXPOSE 8000

# Run the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
