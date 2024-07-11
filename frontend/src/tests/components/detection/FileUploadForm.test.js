// src/tests/components/detection/FileUploadForm.test.js

/**
 * Test 1: renders children inside the form - Ensures the children elements are rendered inside the form.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import FileUploadForm from '../../../components/detection/FileUploadForm';

describe('FileUploadForm Component', () => {
    let handleFileChange, handleSubmit;

    it('renders children inside the form', () => {
        const childText = 'This is a child component';
        render(
            <FileUploadForm handleFileChange={handleFileChange} handleSubmit={handleSubmit} isLoading={false}>
                <div>{childText}</div>
            </FileUploadForm>
        );
        expect(screen.getByText(childText)).to.exist;
    });
});
