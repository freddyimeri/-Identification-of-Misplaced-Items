export const getVideoDuration = (file) => {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            resolve(Math.floor(video.duration)); // Ensure duration is an integer
        };
        video.src = URL.createObjectURL(file);
    });
};

export const calculateMinimumDelay = (duration, framesJump) => {
    const frames = Math.floor(duration / framesJump);
    return Math.max(30 / frames, 1); // Ensure at least 1 second delay per frame
};

export const calculateMaximumDelay = (duration, framesJump) => {
    const frames = Math.floor(duration / framesJump);
    return Math.min(600 / frames, 60); // Ensure the video length does not exceed 10 minutes
};

export const calculateExpectedLength = (duration, framesJump, frameDelay) => {
    const frames = Math.floor(duration / framesJump);
    return frames * frameDelay;
};

export const isValidVideoLength = (duration) => {
    return duration >= 3 && duration <= 600; // Between 3 seconds and 10 minutes
};

export const calculateOptimalValues = (duration) => {
    let framesJump = 1; // Default frame jump value
    let frameDelay = Math.floor(30 / (duration / framesJump));

    if (frameDelay < 1) {
        frameDelay = 1;
        framesJump = Math.floor(30 / (duration * frameDelay));
    }

    return {
        framesJump: Math.max(Math.floor(framesJump), 1), // Minimum 1 second jump
        frameDelay: Math.max(Math.ceil(frameDelay), 1)
    };
};

export const calculateMaxFrameJump = (duration) => {
    return Math.floor(duration / 2); // Ensuring at least 2 frames
};

export const calculateValidFramesJumpOptions = (duration) => {
    const options = [];
    for (let i = 1; i <= duration; i++) {
        if (duration % i === 0 && duration / i >= 2) {
            options.push(i);
        }
    }
    return options;
};

export const calculateMinimumValidFrameDelay = (duration, framesJump) => {
    const frames = Math.floor(duration / framesJump);
    return Math.max(Math.ceil(30 / frames), 1); // Ensure the video length is at least 30 seconds
};

export const isDelayPerFrameValid = (expectedLength) => {
    return expectedLength >= 30 && expectedLength <= 600;
};
