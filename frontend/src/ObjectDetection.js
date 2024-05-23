import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);

    useEffect(() => {
        console.log('Loading model...');
        const loadModel = async () => {
            try {
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
                console.log('Model loaded');
            } catch (error) {
                console.error('Error loading model:', error);
            }
        };
        loadModel();

        const setupCamera = async () => {
            console.log('Setting up camera...');
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480 }
                    });
                    videoRef.current.srcObject = stream;
                    console.log('Camera setup complete');
                } catch (error) {
                    console.error('Error setting up camera:', error);
                }
            } else {
                console.error('getUserMedia not supported in this browser');
                alert('Your browser does not support getUserMedia API');
            }
        };
        setupCamera();
    }, []);

    useEffect(() => {
        if (model) {
            console.log('Starting detection...');
            const detectObjects = async () => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    try {
                        const predictions = await model.detect(videoRef.current);
                        console.log('Predictions:', predictions);
                        drawPredictions(predictions);
                    } catch (error) {
                        console.error('Error detecting objects:', error);
                    }
                }
                requestAnimationFrame(detectObjects);
            };
            detectObjects();
        }
    }, [model]);

    const drawPredictions = predictions => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = 'green';
            ctx.font = '18px Arial';
            ctx.fillText(
                `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
                x,
                y > 10 ? y - 5 : 10
            );
        });
    };

    return (
        <div style={{ position: 'relative', width: '640px', height: '480px' }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="640"
                height="480"
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            />
        </div>
    );
};

export default ObjectDetection;
