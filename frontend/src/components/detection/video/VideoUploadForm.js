import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import VideoInputs from './VideoInputs';
import { getVideoDuration, calculateMinimumValidFrameDelay, calculateMaximumDelay, calculateExpectedLength, calculateOptimalValues, calculateValidFramesJumpOptions, isDelayPerFrameValid } from './videoUtils';

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

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="videoFile">
                <Form.Label>Upload Video</Form.Label>
                <Form.Control type="file" accept="video/*" onChange={handleFileInputChange} disabled={isLoading} />
            </Form.Group>
            {isVideoUploaded && (
                <VideoInputs
                    framesJump={framesJump}
                    frameDelay={frameDelay}
                    handleFramesJumpChange={handleFramesJumpChange}
                    handleFrameDelayChange={handleFrameDelayChange}
                    validFramesJumpOptions={validFramesJumpOptions}
                    minFrameDelay={minFrameDelay}
                    maxFrameDelay={maxFrameDelay}
                    isLoading={isLoading}
                    videoDuration={videoDuration}
                    updateConstraintsAndExpectedLength={updateConstraintsAndExpectedLength}
                />
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
