// const assert = require('assert');
// const {
//     getVideoDuration,
//     calculateMinimumDelay,
//     calculateMaximumDelay,
//     calculateExpectedLength,
//     isValidVideoLength,
//     calculateOptimalValues,
//     calculateMaxFrameJump,
//     calculateValidFramesJumpOptions,
//     calculateMinimumValidFrameDelay,
//     isDelayPerFrameValid
// } = require('../../../../components/detection/video/videoUtils');

// // Mocking a video file for testing getVideoDuration function
// global.URL.createObjectURL = () => 'blob://mocked-url';
// global.URL.revokeObjectURL = () => { };

// describe('VideoInputs.js Functions', function () {
//     // Increase the default timeout for async tests
//     this.timeout(5000);

//     // Mocking getVideoDuration test
//     it('should return correct video duration', function (done) {
//         const mockFile = new Blob([''], { type: 'video/mp4' });
//         getVideoDuration(mockFile).then(duration => {
//             assert.strictEqual(duration, 60);
//             done();
//         }).catch(done);
//         // Simulate video duration
//         setTimeout(() => {
//             const video = document.querySelector('video');
//             if (video) {
//                 Object.defineProperty(video, 'duration', { get: () => 60 });
//                 video.dispatchEvent(new Event('loadedmetadata'));
//             }
//         }, 100);
//     });

//     it('should calculate minimum delay correctly', function () {
//         const duration = 60;
//         const framesJump = 2;
//         const minDelay = calculateMinimumDelay(duration, framesJump);
//         assert.strictEqual(minDelay, 1);
//     });

//     it('should calculate maximum delay correctly', function () {
//         const duration = 60;
//         const framesJump = 30;
//         const maxDelay = calculateMaximumDelay(duration, framesJump);
//         assert.strictEqual(maxDelay, 60);
//     });

//     it('should calculate expected length correctly', function () {
//         const duration = 60;
//         const framesJump = 2;
//         const frameDelay = 2;
//         const expectedLength = calculateExpectedLength(duration, framesJump, frameDelay);
//         assert.strictEqual(expectedLength, 60);
//     });

//     it('should validate video length correctly', function () {
//         assert.strictEqual(isValidVideoLength(2), false);
//         assert.strictEqual(isValidVideoLength(5), true);
//         assert.strictEqual(isValidVideoLength(700), false);
//     });

//     it('should calculate optimal values correctly', function () {
//         const duration = 60;
//         const { framesJump, frameDelay } = calculateOptimalValues(duration);
//         assert.strictEqual(framesJump, 1);
//         assert.strictEqual(frameDelay, 1);
//     });

//     it('should calculate max frame jump correctly', function () {
//         const duration = 60;
//         const maxFrameJump = calculateMaxFrameJump(duration);
//         assert.strictEqual(maxFrameJump, 30);
//     });

//     it('should calculate valid frames jump options correctly', function () {
//         const duration = 60;
//         const options = calculateValidFramesJumpOptions(duration);
//         assert.deepStrictEqual(options, [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]);
//     });

//     it('should calculate minimum valid frame delay correctly', function () {
//         const duration = 60;
//         const framesJump = 2;
//         const minFrameDelay = calculateMinimumValidFrameDelay(duration, framesJump);
//         assert.strictEqual(minFrameDelay, 1);
//     });

//     it('should validate delay per frame correctly', function () {
//         assert.strictEqual(isDelayPerFrameValid(20), false);
//         assert.strictEqual(isDelayPerFrameValid(300), true);
//         assert.strictEqual(isDelayPerFrameValid(700), false);
//     });
// });
