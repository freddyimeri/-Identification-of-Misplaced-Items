import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getVideoDuration, calculateMinimumDelay, calculateMaximumDelay, calculateExpectedLength, isValidVideoLength, calculateOptimalValues, calculateMaxFrameJump, isDelayPerFrameValid, calculateValidFramesJumpOptions, calculateMinimumValidFrameDelay } from './videoUtils';

const VideoUploadForm = ({ handleFileChange, handleSubmit, handleFramesJumpChange, handleFrameDelayChange, framesJump, frameDelay, isLoading }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [expectedLength, setExpectedLength] = useState(0);
    const [maxFrameDelay, setMaxFrameDelay] = useState(60);
    const [minFrameDelay, setMinFrameDelay] = useState(1);
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
    const [validFramesJumpOptions, setValidFramesJumpOptions] = useState([]);

    useEffect(() => {
        if (videoFile) {
            console.log('Video file uploaded:', videoFile);
            getVideoDuration(videoFile).then(duration => {
                console.log('Video duration:', duration);
                setVideoDuration(duration);
                const { framesJump, frameDelay } = calculateOptimalValues(duration);
                updateConstraintsAndExpectedLength(duration, framesJump, frameDelay);
                handleFramesJumpChange({ target: { value: framesJump } });
                handleFrameDelayChange({ target: { value: frameDelay } });
                setValidFramesJumpOptions(calculateValidFramesJumpOptions(duration));
                setIsVideoUploaded(true);
            }).catch(error => {
                console.error('Error getting video duration:', error);
            });
        }
    }, [videoFile]);

    const calculateValidFramesJumpOptions = (duration) => {
        const options = [];
        for (let i = 1; i <= duration; i++) {
            if (duration % i === 0 && duration / i >= 2) {
                options.push(i);
            }
        }
        return options;
    };

    const updateConstraintsAndExpectedLength = (duration, framesJump, frameDelay) => {
        const minDelay = calculateMinimumValidFrameDelay(duration, framesJump);
        const maxDelay = calculateMaximumDelay(duration, framesJump);

        setMinFrameDelay(minDelay);
        setMaxFrameDelay(maxDelay);

        const expectedLen = calculateExpectedLength(duration, framesJump, frameDelay);
        setExpectedLength(expectedLen);

        // Adjust frame delay to valid range if necessary
        if (!isDelayPerFrameValid(expectedLen)) {
            const adjustedDelay = expectedLen < 30 ? minDelay : maxDelay;
            handleFrameDelayChange({ target: { value: adjustedDelay } });
            setExpectedLength(calculateExpectedLength(duration, framesJump, adjustedDelay));
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setVideoFile(file);
        handleFileChange(event);
    };

    const handleFramesJumpInputChange = (event) => {
        const value = parseInt(event.target.value);
        handleFramesJumpChange({ target: { value } });
        updateConstraintsAndExpectedLength(videoDuration, value, frameDelay);
    };

    const handleFrameDelayInputChange = (event) => {
        const value = Math.min(Math.max(parseInt(event.target.value), minFrameDelay), maxFrameDelay);
        handleFrameDelayChange({ target: { value } });
        setExpectedLength(calculateExpectedLength(videoDuration, framesJump, value));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="videoFile">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control type="file" accept="video/*" onChange={handleFileInputChange} disabled={isLoading} />
            </Form.Group>
            {isVideoUploaded && (
                <>
                    <Form.Group controlId="framesJump">
                        <Form.Label>Frames Jump Seconds</Form.Label>
                        <Form.Control
                            as="select"
                            value={framesJump}
                            onChange={handleFramesJumpInputChange}
                            disabled={isLoading}
                        >
                            {validFramesJumpOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="frameDelay">
                        <Form.Label>Delay per Frame (seconds)</Form.Label>
                        <Form.Control
                            type="number"
                            value={frameDelay}
                            onChange={handleFrameDelayInputChange}
                            min={minFrameDelay}
                            max={maxFrameDelay}
                            step="1"
                            disabled={isLoading}
                        />
                    </Form.Group>
                </>
            )}
            {isVideoUploaded && <p>Expected output video length: {expectedLength} seconds</p>}
            <Button variant="primary" type="submit" disabled={isLoading || expectedLength > 600 || expectedLength < 30 || !isVideoUploaded}>
                {isLoading ? 'Processing...' : 'Upload'}
            </Button>
            {isVideoUploaded && expectedLength > 600 && <p style={{ color: 'red' }}>The expected video length exceeds the maximum allowed duration of 10 minutes.</p>}
            {isVideoUploaded && expectedLength < 30 && <p style={{ color: 'red' }}>The expected video length must be at least 30 seconds.</p>}
        </Form>
    );
};

export default VideoUploadForm;