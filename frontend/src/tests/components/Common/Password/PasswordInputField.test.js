// src/tests/components/Common/Password/PasswordInputField.test.js

/**
 * Test 1: renders the password input field with label - Ensure the PasswordInputField component renders correctly with a label.
 * Test 2: toggles password visibility - Ensure the password visibility toggle works correctly.
 * Test 3: displays password requirements - Ensure the PasswordRequirements component is displayed when showRequirements is true.
 */

// This test suite validates the functionality of the PasswordInputField component, ensuring it renders correctly, toggles password visibility, and optionally displays password requirements.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import PasswordInputField from '../../../../components/Common/Password/PasswordInputField';
import sinon from 'sinon';

describe('PasswordInputField Component', () => {
    // Test to check if the PasswordInputField component renders correctly with a label
    it('renders the password input field with label', () => {
        render(<PasswordInputField label="Password" value="" onChange={() => { }} />);

        // Ensure the label is displayed
        expect(screen.getByText(/Password/i)).to.exist;

        // Ensure the input field is displayed
        expect(screen.getByLabelText(/Password/i)).to.have.property('type', 'password');
    });

    // Test to check if the password visibility toggle works correctly
    it('toggles password visibility', () => {
        render(<PasswordInputField label="Password" value="password" onChange={() => { }} />);

        const toggleIcon = screen.getByTitle(/Show Password/i);

        // Ensure the input type is initially password
        const inputField = screen.getByLabelText(/Password/i);
        expect(inputField.type).to.equal('password');

        // Click the toggle icon to show the password
        fireEvent.click(toggleIcon);
        expect(inputField.type).to.equal('text');

        // Click the toggle icon to hide the password
        fireEvent.click(toggleIcon);
        expect(inputField.type).to.equal('password');
    });

    // Test to check if the PasswordRequirements component is displayed when showRequirements is true
    it('displays password requirements', () => {
        render(<PasswordInputField label="Password" value="password" onChange={() => { }} showRequirements={true} />);

        // Ensure the PasswordRequirements component is displayed
        expect(screen.getByText(/Your password must meet the following requirements:/i)).to.exist;
    });
});
