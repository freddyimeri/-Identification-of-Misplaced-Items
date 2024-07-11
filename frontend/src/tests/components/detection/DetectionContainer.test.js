// src/tests/components/detection/DetectionContainer.test.js

/**
 * Test 1: renders the container with the given title - Ensures the title is displayed correctly.
 * Test 2: renders children inside the container - Ensures the children elements are rendered inside the container.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import DetectionContainer from '../../../components/detection/DetectionContainer';

describe('DetectionContainer Component', () => {
    it('renders the container with the given title', () => {
        const title = 'Detection Title';
        render(<DetectionContainer title={title}><div /></DetectionContainer>);
        expect(screen.getByText(title)).to.exist;
    });

    it('renders children inside the container', () => {
        const title = 'Detection Title';
        const childText = 'This is a child component';
        render(
            <DetectionContainer title={title}>
                <div>{childText}</div>
            </DetectionContainer>
        );
        expect(screen.getByText(childText)).to.exist;
    });
});
