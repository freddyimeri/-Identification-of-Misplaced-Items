// main.js
const startButton = document.getElementById('startDetection');
const stopButton = document.getElementById('stopDetection');
const fullscreenButton = document.getElementById('fullscreenButton');

async function startDetection() {
    if (!model) {
        console.log('Model is not loaded yet.');
        return;
    }

    stopButton.style.display = 'block';
    startButton.style.display = 'none';
    detectFrame();
}

function stopDetection() {
    stopButton.style.display = 'none';
    startButton.style.display = 'block';
    stopVideo();
}

// Initialize and handle events
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startDetection').addEventListener('click', startDetection);
    document.getElementById('stopDetection').addEventListener('click', stopDetection);
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullScreen);
});
