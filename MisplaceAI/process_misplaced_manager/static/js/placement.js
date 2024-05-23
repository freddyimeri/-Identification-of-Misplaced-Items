// placement.js
// Utility function to handle errors
function handleError(message, error) {
    console.error(message, error);
    alert(`${message}: ${error.message}. Please try again.`);
}

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Function to check placement of detected objects
function checkPlacement(predictions) {
    const data = predictions.map(prediction => ({
        class_name: prediction.class,
        xmin: prediction.bbox[0],
        ymin: prediction.bbox[1],
        xmax: prediction.bbox[0] + prediction.bbox[2],
        ymax: prediction.bbox[1] + prediction.bbox[3],
    }));

    fetch('/placement_rules/check_placement/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Placement check result:', data);
            handlePlacementCheckResult(data.misplaced_items);
        })
        .catch((error) => {
            handleError('Error checking placement', error);
        });
}

// Function to handle the placement check results
function handlePlacementCheckResult(misplacedItems) {
    const context = canvas.getContext('2d');

    misplacedItems.forEach(item => {
        const [x, y, width, height] = [item.xmin, item.ymin, item.xmax - item.xmin, item.ymax - item.ymin];
        const text = `${item.class_name} is misplaced. Allowed locations: ${item.allowed_locations.join(', ')}`;

        context.strokeStyle = '#FF0000'; // Red color for misplaced items
        context.lineWidth = 2;
        context.strokeRect(x, y, width, height);

        context.fillStyle = '#FF0000';
        context.font = '18px Arial';
        context.fillText(text, x, y > 10 ? y - 5 : y + 15);
    });
}

// Function to initialize and handle events
function initializePlacement() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Placement module initialized');
    });

    // Example event listener for a button to trigger placement check manually
    const checkPlacementButton = document.getElementById('checkPlacement');
    if (checkPlacementButton) {
        checkPlacementButton.addEventListener('click', () => {
            console.log('Manual placement check triggered');
            // Here you would typically call a function to capture the current video frame and run detection
            captureFrameAndCheckPlacement();
        });
    }
}

// Function to capture frame and check placement
// This is a placeholder function. Replace it with your actual frame capture and detection logic.
function captureFrameAndCheckPlacement() {
    if (video.readyState === 4) {
        model.detect(video).then(predictions => {
            console.log('Predictions for manual check:', predictions);
            checkPlacement(predictions);
        }).catch(error => handleError('Error detecting objects', error));
    }
}

// Initialize the placement module
initializePlacement();
