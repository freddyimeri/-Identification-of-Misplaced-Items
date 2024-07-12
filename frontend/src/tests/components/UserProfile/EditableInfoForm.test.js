// src/tests/components/UserProfile/EditableInfoForm.test.js

/**
 * Test ID-> EIF1: Ensure the EditableInfoForm component renders correctly.
 * Test ID-> EIF2: Ensure the input fields capture user input correctly.
 * Test ID-> EIF3: Ensure the onSubmit callback is triggered with correct data when the form is submitted.
 * Test ID-> EIF4: Ensure the onCancel callback is triggered when the cancel button is clicked.
 * Test ID-> EIF5: Ensure the error message is displayed when there is an error.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import EditableInfoForm from '../../../components/UserProfile/EditableInfoForm';

describe('EditableInfoForm Component', () => {
    it('renders the EditableInfoForm component correctly', () => {
        // Test ID-> EIF1
        const props = {
            label: 'Info',
            type: 'text',
            onSubmit: () => { },
            onCancel: () => { },
            loading: false,
            error: ''
        };

        render(<EditableInfoForm {...props} />);

        expect(screen.getByLabelText(/New Info/i)).to.exist;
        expect(screen.getByLabelText(/Password/i)).to.exist;
        expect(screen.getByText(/Update Info/i)).to.exist;
        expect(screen.getByText(/Cancel/i)).to.exist;
    });

    it('captures user input correctly', () => {
        // Test ID-> EIF2
        const props = {
            label: 'Info',
            type: 'text',
            onSubmit: () => { },
            onCancel: () => { },
            loading: false,
            error: ''
        };

        render(<EditableInfoForm {...props} />);

        const newInfoInput = screen.getByLabelText(/New Info/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(newInfoInput, { target: { value: 'New Information' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        expect(newInfoInput.value).to.equal('New Information');
        expect(passwordInput.value).to.equal('password');
    });

    it('triggers onSubmit callback with correct data when the form is submitted', () => {
        // Test ID-> EIF3
        const onSubmitSpy = sinon.spy();
        const props = {
            label: 'Info',
            type: 'text',
            onSubmit: onSubmitSpy,
            onCancel: () => { },
            loading: false,
            error: ''
        };

        render(<EditableInfoForm {...props} />);

        const newInfoInput = screen.getByLabelText(/New Info/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(newInfoInput, { target: { value: 'New Information' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.submit(screen.getByRole('form'));

        expect(onSubmitSpy.calledOnce).to.be.true;
        expect(onSubmitSpy.calledWith({ newInfo: 'New Information', password: 'password' })).to.be.true;
    });

    it('triggers onCancel callback when the cancel button is clicked', () => {
        // Test ID-> EIF4
        const onCancelSpy = sinon.spy();
        const props = {
            label: 'Info',
            type: 'text',
            onSubmit: () => { },
            onCancel: onCancelSpy,
            loading: false,
            error: ''
        };

        render(<EditableInfoForm {...props} />);

        fireEvent.click(screen.getByText(/Cancel/i));

        expect(onCancelSpy.calledOnce).to.be.true;
    });

    it('displays error message when there is an error', () => {
        // Test ID-> EIF5
        const props = {
            label: 'Info',
            type: 'text',
            onSubmit: () => { },
            onCancel: () => { },
            loading: false,
            error: 'Test Error Message'
        };

        render(<EditableInfoForm {...props} />);

        expect(screen.getByText(/Test Error Message/i)).to.exist;
    });
});
