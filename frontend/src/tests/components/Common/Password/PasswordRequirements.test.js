// src/tests/components/Common/Password/PasswordRequirements.test.js

/**
 * Test 1: displays password requirements - Ensure the password requirements header is displayed.
 * Test 2: indicates requirement for at least 8 characters - Ensure the requirement for at least 8 characters is displayed correctly.
 * Test 3: indicates requirement for at least one uppercase letter - Ensure the requirement for at least one uppercase letter is displayed correctly.
 * Test 4: indicates requirement for at least one lowercase letter - Ensure the requirement for at least one lowercase letter is displayed correctly.
 * Test 5: indicates requirement for at least one number - Ensure the requirement for at least one number is displayed correctly.
 */

// This test suite validates the functionality of the PasswordRequirements component, ensuring it correctly displays the password criteria based on the input password.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import PasswordRequirements from '../../../../components/Common/Password/PasswordRequirements';

describe('PasswordRequirements Component', () => {
    // Test to check if the password requirements header is displayed
    it('displays password requirements', () => {
        render(<PasswordRequirements password="" />);
        expect(screen.getByText(/Your password must meet the following requirements:/i)).to.exist;
    });

    // Test to check if the requirement for at least 8 characters is displayed correctly
    it('indicates requirement for at least 8 characters', () => {
        render(<PasswordRequirements password="short" />);

        const elements = screen.getAllByText(/At least 8 characters/i);
        const isTextMuted = Array.from(elements).some(el => el.classList.contains('text-muted'));
        expect(isTextMuted).to.be.true;

        render(<PasswordRequirements password="longenough" />);

        const updatedElements = screen.getAllByText(/At least 8 characters/i);
        const isTextSuccess = Array.from(updatedElements).some(el => el.classList.contains('text-success'));
        expect(isTextSuccess).to.be.true;
    });

    // Test to check if the requirement for at least one uppercase letter is displayed correctly
    it('indicates requirement for at least one uppercase letter', () => {
        render(<PasswordRequirements password="lowercase" />);

        const elements = screen.getAllByText(/At least one uppercase letter/i);
        const isTextMuted = Array.from(elements).some(el => el.classList.contains('text-muted'));
        expect(isTextMuted).to.be.true;

        render(<PasswordRequirements password="Uppercase" />);

        const updatedElements = screen.getAllByText(/At least one uppercase letter/i);
        const isTextSuccess = Array.from(updatedElements).some(el => el.classList.contains('text-success'));
        expect(isTextSuccess).to.be.true;
    });

    // Test to check if the requirement for at least one lowercase letter is displayed correctly
    it('indicates requirement for at least one lowercase letter', () => {
        render(<PasswordRequirements password="UPPERCASE" />);

        const elements = screen.getAllByText(/At least one lowercase letter/i);
        const isTextMuted = Array.from(elements).some(el => el.classList.contains('text-muted'));
        expect(isTextMuted).to.be.true;

        render(<PasswordRequirements password="Lowercase" />);

        const updatedElements = screen.getAllByText(/At least one lowercase letter/i);
        const isTextSuccess = Array.from(updatedElements).some(el => el.classList.contains('text-success'));
        expect(isTextSuccess).to.be.true;
    });

    // Test to check if the requirement for at least one number is displayed correctly
    it('indicates requirement for at least one number', () => {
        render(<PasswordRequirements password="NoNumbers" />);

        const elements = screen.getAllByText(/At least one number/i);
        const isTextMuted = Array.from(elements).some(el => el.classList.contains('text-muted'));
        expect(isTextMuted).to.be.true;

        render(<PasswordRequirements password="Number1" />);

        const updatedElements = screen.getAllByText(/At least one number/i);
        const isTextSuccess = Array.from(updatedElements).some(el => el.classList.contains('text-success'));
        expect(isTextSuccess).to.be.true;
    });
});
