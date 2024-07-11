// src/tests/components/detection/VideoUploadForm.test.js

/**
 * Test 1: renders the frame interval input - Ensures the frame interval input element is rendered correctly.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import VideoUploadForm from '../../../components/detection/VideoUploadForm';

describe('VideoUploadForm Component', () => {


    it('renders the frame interval input', () => {
        render(<VideoUploadForm />);
        expect(screen.getByLabelText(/frame interval/i)).to.exist;
    });


});
