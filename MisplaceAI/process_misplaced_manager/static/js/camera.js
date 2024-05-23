// camera.js
let stream;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const cameraSelect = document.getElementById('cameraSelect');
const videoContainer = document.getElementById('videoContainer');
const context = canvas.getContext('2d');
let model;

// Utility function to handle errors
function handleError(message, error) {
    console.error(message, error);
    alert(`${message}: ${error.message}. Please check your camera and try again.`);
}

// Populate camera options for selection
function populateCameraOptions() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            cameraSelect.innerHTML = '';
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
        })
        .catch(error => handleError('Error listing cameras', error));
}

// Start the video stream from the selected camera
async function startVideo() {
    try {
        const videoSource = cameraSelect.value;
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: videoSource,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "environment" // Prefer rear camera on mobile
            }
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            adjustVideoCanvas();
        };
    } catch (error) {
        handleError('Error accessing the camera', error);
    }
}

// Stop the video stream
function stopVideo() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Adjust video and canvas elements for responsive design
function adjustVideoCanvas() {
    const aspectRatio = 16 / 9;
    const containerWidth = videoContainer.clientWidth;

    videoContainer.style.height = `${containerWidth / aspectRatio}px`;

    video.width = videoContainer.clientWidth;
    video.height = videoContainer.clientHeight;
    canvas.width = videoContainer.clientWidth;
    canvas.height = videoContainer.clientHeight;
}

// Draw predictions on the canvas
function drawPredictions(predictions) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;

        // Draw bounding box
        context.strokeStyle = '#00FF00';
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);

        // Draw label
        context.fillStyle = '#00FF00';
        context.font = '18px Arial';
        context.fillText(text, x, y > 10 ? y - 5 : y + 15);
    });
}

// Detect frame and make predictions
async function detectFrame() {
    if (video.readyState === 4) {
        const predictions = await model.detect(video);
        console.log(predictions);

        drawPredictions(predictions);

        // Send the predictions to the server for rule checking
        checkPlacement(predictions);
    }

    if (document.getElementById('stopDetection').style.display === 'block') {
        requestAnimationFrame(detectFrame);
    }
}

// Start detection
function startDetection() {
    if (!model) {
        console.log('Model is not loaded yet.');
        return;
    }

    document.getElementById('stopDetection').style.display = 'block';
    document.getElementById('startDetection').style.display = 'none';
    detectFrame();
}

// Stop detection
function stopDetection() {
    document.getElementById('stopDetection').style.display = 'none';
    document.getElementById('startDetection').style.display = 'block';
    stopVideo();
}

// Toggle full screen
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Initialize Plyr for enhanced video controls
const player = new Plyr(video, {
    controls: ['play', 'progress', 'mute', 'volume', 'fullscreen'],
});

// Initialize and handle events
document.addEventListener('DOMContentLoaded', () => {
    populateCameraOptions();
    adjustVideoCanvas();
    startVideo();
    loadModel();

    // Use ResizeObserver to handle dynamic resizing
    const resizeObserver = new ResizeObserver(() => adjustVideoCanvas());
    resizeObserver.observe(videoContainer);

    window.addEventListener('resize', adjustVideoCanvas);

    document.getElementById('startDetection').addEventListener('click', startDetection);
    document.getElementById('stopDetection').addEventListener('click', stopDetection);
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullScreen);

    cameraSelect.addEventListener('change', () => {
        stopVideo();
        startVideo();
    });
});
