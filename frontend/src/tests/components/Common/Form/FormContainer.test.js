// src/tests/components/Common/Form/FormContainer.test.js
// This test suite validates the functionality of the FormContainer component, ensuring it correctly renders children, displays error messages, and handles form submissions.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import FormContainer from '../../../../components/Common/Form/FormContainer';
import ErrorMessage from '../../../../components/Common/Form/ErrorMessage';

describe('FormContainer Component', () => {
    it('renders children', () => {
        // Arrange & Act: Render the FormContainer component with a child component
        render(
            <FormContainer onSubmit={() => { }}>
                <div>Child Component</div>
            </FormContainer>
        );

        // Assert: Check if the child component is rendered
        expect(screen.getByText(/Child Component/i)).to.exist;
    });

    it('displays error message when submit fails', async () => {
        // Arrange: Set up the onSubmit function to reject with an error message
        const errorMessage = "An error occurred";
        const onSubmit = sinon.stub().rejects(new Error(errorMessage));

        // Act: Render the FormContainer component and simulate form submission
        render(
            <FormContainer onSubmit={onSubmit}>
                <button type="submit">Submit</button>
            </FormContainer>
        );

        // Act: Click the submit button
        fireEvent.click(screen.getByText(/Submit/i));

        // Assert: Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).to.exist;
        });
    });

    it('calls onSubmit when form is submitted', async () => {
        // Arrange: Set up the onSubmit function to resolve successfully
        const onSubmit = sinon.stub().resolves();

        // Act: Render the FormContainer component and simulate form submission
        render(
            <FormContainer onSubmit={onSubmit}>
                <button type="submit">Submit</button>
            </FormContainer>
        );

        // Act: Click the submit button
        fireEvent.click(screen.getByText(/Submit/i));

        // Assert: Wait for the onSubmit function to be called
        await waitFor(() => {
            expect(onSubmit.calledOnce).to.be.true;
        });
    });
});
