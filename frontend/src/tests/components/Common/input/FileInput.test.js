// src/tests/components/Common/input/FileInput.test.js

/**
 * Test 1: renders the file input with upload button - Ensure the FileInput component renders correctly with the upload button when no file is selected.
 * Test 2: displays the file name and remove button when a file is selected - Ensure the component displays the file name and remove button when a file is selected.
 * Test 3: calls onRemove when the remove button is clicked - Ensure the onRemove callback is called when the remove button is clicked.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import FileInput from '../../../../components/Common/input/FileInput';

describe('FileInput Component', () => {
    // Clean up the DOM after each test to avoid interference
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Test to check if the FileInput component renders correctly with the upload button when no file is selected
    it('renders the file input with upload button', () => {
        render(<FileInput label="Upload File" onChange={() => { }} onRemove={() => { }} />);
        expect(screen.getByText(/Upload File/i)).to.exist;
        expect(screen.getByText(/Upload Video/i)).to.exist;
    });
    // Test to check if the component displays the file name and remove button when a file is selected
    it('displays the file name and remove button when a file is selected', () => {
        render(<FileInput label="Upload File" onChange={() => { }} onRemove={() => { }} fileName="video.mp4" />);
        expect(screen.getByText(/video.mp4/i)).to.exist;
        expect(screen.getByText(/Remove/i)).to.exist;
    });

    // Test to check if the onRemove callback is called when the remove button is clicked
    it('calls onRemove when the remove button is clicked', () => {
        const onRemoveSpy = sinon.spy();
        render(<FileInput label="Upload File" onChange={() => { }} onRemove={onRemoveSpy} fileName="video.mp4" />);
        fireEvent.click(screen.getByText(/Remove/i));
        expect(onRemoveSpy.calledOnce).to.be.true;
    });
});
