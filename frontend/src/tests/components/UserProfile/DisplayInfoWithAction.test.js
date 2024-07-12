// src/tests/components/UserProfile/DisplayInfoWithAction.test.js

/**
 * Test ID-> DIWA1: Ensure the DisplayInfoWithAction component renders correctly.
 * Test ID-> DIWA2: Ensure the onActionClick callback is triggered when the button is clicked.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DisplayInfoWithAction from '../../../components/UserProfile/DisplayInfoWithAction';

describe('DisplayInfoWithAction Component', () => {
    it('renders the DisplayInfoWithAction component correctly', () => {
        // Test ID-> DIWA1
        const props = {
            title: 'Test Title',
            info: 'Test Info',
            buttonLabel: 'Test Button',
            onActionClick: () => { },
        };

        render(<DisplayInfoWithAction {...props} />);

        expect(screen.getByText(/Test Title/i)).to.exist;
        expect(screen.getByText(/Test Info/i)).to.exist;
        expect(screen.getByText(/Test Button/i)).to.exist;
    });

    it('triggers onActionClick callback when button is clicked', () => {
        // Test ID-> DIWA2
        const onActionClickSpy = sinon.spy();
        const props = {
            title: 'Test Title',
            info: 'Test Info',
            buttonLabel: 'Test Button',
            onActionClick: onActionClickSpy,
        };

        render(<DisplayInfoWithAction {...props} />);

        fireEvent.click(screen.getByText(/Test Button/i));

        expect(onActionClickSpy.calledOnce).to.be.true;
    });
});
