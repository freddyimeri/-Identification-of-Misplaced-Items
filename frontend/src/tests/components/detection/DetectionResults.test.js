// src/tests/components/detection/DetectionResults.test.js

/**
 * Test 1: renders detection results when result is present - Ensures the component renders the results when the result prop is provided.
 * Test 2: displays error message when result contains an error - Ensures the component displays an error message when the result contains an error.
 * Test 3: lists misplaced objects correctly - Ensures the misplaced objects are listed correctly with their allowed locations.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import DetectionResults from '../../../components/detection/DetectionResults';

describe('DetectionResults Component', () => {
    it('renders detection results when result is present', () => {
        const result = {
            output_video_url: 'http://example.com/video.mp4',
            output_image_url: 'http://example.com/image.jpg',
            misplaced_objects: [
                { class_name: 'Object1', allowed_locations: ['Location1', 'Location2'] },
                { class_name: 'Object2', allowed_locations: ['Location3'] },
            ]
        };
        render(<DetectionResults result={result} />);
        expect(screen.getByText(/Detection Results/i)).to.exist;
    });

    it('displays error message when result contains an error', () => {
        const result = { error: 'An error occurred' };
        render(<DetectionResults result={result} />);
        expect(screen.getByText(/An error occurred/i)).to.exist;
    });



    it('lists misplaced objects correctly', () => {
        const result = {
            misplaced_objects: [
                { class_name: 'Object1', allowed_locations: ['Location1', 'Location2'] },
                { class_name: 'Object2', allowed_locations: ['Location3'] },
            ]
        };
        render(<DetectionResults result={result} />);
        expect(screen.getByText(/Object1 is misplaced. Allowed locations: Location1, Location2/i)).to.exist;
        expect(screen.getByText(/Object2 is misplaced. Allowed locations: Location3/i)).to.exist;
    });
});
