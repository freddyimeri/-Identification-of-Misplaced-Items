import React, { useEffect } from 'react';
import Dropdown from '../../Common/input/Dropdown';
import NumberInput from '../../Common/input/NumberInput';
import { Form } from 'react-bootstrap';
const VideoInputs = ({ framesJump, frameDelay, handleFramesJumpChange, handleFrameDelayChange, validFramesJumpOptions, minFrameDelay, maxFrameDelay, isLoading, videoDuration, updateConstraintsAndExpectedLength }) => {

    useEffect(() => {
        if (framesJump && frameDelay) {
            updateConstraintsAndExpectedLength(videoDuration, framesJump, frameDelay);
        }
    }, [framesJump, frameDelay, videoDuration, updateConstraintsAndExpectedLength]);

    const handleFramesJumpInputChange = (item) => {
        const value = parseInt(item);
        handleFramesJumpChange({ target: { value } });
        updateConstraintsAndExpectedLength(videoDuration, value, frameDelay);
    };

    const handleFrameDelayInputChange = (value) => {
        handleFrameDelayChange({ target: { value } });
        updateConstraintsAndExpectedLength(videoDuration, framesJump, value);
    };

    return (
        <>
            <Form.Group controlId="framesJump">
                <Form.Label>Frames Jump Seconds</Form.Label>
                <Dropdown
                    items={validFramesJumpOptions}
                    selectedItem={framesJump.toString()}
                    onItemSelect={handleFramesJumpInputChange}
                    className={isLoading ? "disabled" : ""}
                />
            </Form.Group>
            <Form.Group controlId="frameDelay">
                <Form.Label>Delay per Frame (seconds)</Form.Label>
                <NumberInput
                    value={frameDelay}
                    min={minFrameDelay}
                    max={maxFrameDelay}
                    step={1}
                    onValueChange={handleFrameDelayInputChange}
                    disabled={isLoading}
                />
            </Form.Group>
        </>
    );
};

export default VideoInputs;
