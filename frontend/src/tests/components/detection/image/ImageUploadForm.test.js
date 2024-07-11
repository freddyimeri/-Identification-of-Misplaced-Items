// src/tests/components/detection/image/ImageUploadForm.test.js

/**
 * Test 1: renders the form with buttons - Ensure the ImageUploadForm component renders correctly with all its buttons.
 * Test 2: calls handleCameraClick when TakePhotoButton is clicked - Ensure the handleCameraClick callback is called when the TakePhotoButton is clicked.
 * Test 3: calls handleGalleryClick when gallery button is clicked - Ensure the handleGalleryClick callback is called when the gallery button is clicked.
 * Test 4: calls handleSubmit when UploadButton is clicked - Ensure the handleSubmit callback is called when the UploadButton is clicked.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ImageUploadForm from '../../../../components/detection/image/ImageUploadForm';

describe('ImageUploadForm Component', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('renders the form with buttons', () => {
        render(<ImageUploadForm />);
        expect(screen.getByText(/Choose from Gallery/i)).to.exist;
        expect(screen.getByText(/Take Photo/i)).to.exist;
        expect(screen.getByText(/Upload/i)).to.exist;
    });



    it('calls handleCameraClick when TakePhotoButton is clicked', () => {
        const handleCameraClickSpy = sinon.spy();
        render(<ImageUploadForm handleCameraClick={handleCameraClickSpy} />);

        fireEvent.click(screen.getByText(/Take Photo/i));

        expect(handleCameraClickSpy.calledOnce).to.be.true;
    });

    it('calls handleGalleryClick when gallery button is clicked', () => {
        const handleGalleryClickSpy = sinon.spy();
        render(<ImageUploadForm handleGalleryClick={handleGalleryClickSpy} />);

        fireEvent.click(screen.getByText(/Choose from Gallery/i));

        expect(handleGalleryClickSpy.calledOnce).to.be.true;
    });

    it('calls handleSubmit when UploadButton is clicked', () => {
        const handleSubmitSpy = sinon.spy();
        render(<ImageUploadForm handleSubmit={handleSubmitSpy} />);

        fireEvent.click(screen.getByText(/Upload/i));

        expect(handleSubmitSpy.calledOnce).to.be.true;
    });
});
