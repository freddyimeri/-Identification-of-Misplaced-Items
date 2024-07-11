// src/tests/components/detection/LoadingIndicator.test.js

/**
 * Test 1: renders loading indicator when isLoading is true - Ensures the loading indicator is displayed when the isLoading prop is true.
 * Test 2: does not render loading indicator when isLoading is false - Ensures the loading indicator is not displayed when the isLoading prop is false.
 * Test 3: displays the correct loading message - Ensures the message passed via the message prop is displayed correctly.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import LoadingIndicator from '../../../components/detection/LoadingIndicator';

describe('LoadingIndicator Component', () => {
    it('renders loading indicator when isLoading is true', () => {
        render(<LoadingIndicator isLoading={true} message="Loading, please wait..." />);
        expect(screen.getByAltText('Loading...')).to.exist;
        expect(screen.getByText('Loading, please wait...')).to.exist;
    });

    it('does not render loading indicator when isLoading is false', () => {
        render(<LoadingIndicator isLoading={false} message="Loading, please wait..." />);
        expect(screen.queryByAltText('Loading...')).to.not.exist;
        expect(screen.queryByText('Loading, please wait...')).to.not.exist;
    });

    it('displays the correct loading message', () => {
        const message = "Loading your data...";
        render(<LoadingIndicator isLoading={true} message={message} />);
        expect(screen.getByText(message)).to.exist;
    });
});
