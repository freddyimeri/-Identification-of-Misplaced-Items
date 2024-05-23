// model.js
let model;

async function loadModel() {
    console.log('Loading model...');
    try {
        model = await cocoSsd.load();
        console.log('Model loaded.');
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Error loading model. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadModel();
});
