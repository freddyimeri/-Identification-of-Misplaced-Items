// src/tests/components/Common/Form/ErrorMessage.test.js
// This test suite validates the functionality of the ErrorMessage component, ensuring it correctly displays an error message passed as a prop.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import ErrorMessage from '../../../../components/Common/Form/ErrorMessage';

describe('ErrorMessage Component', () => {
    it('displays the error message', () => {
        // Arrange: Set up the error message to be displayed
        const message = "This is an error message";

        // Act: Render the ErrorMessage component with the message
        render(<ErrorMessage message={message} />);

        // Assert: Check if the message is displayed
        expect(screen.getByText(message)).to.exist;
    });
});
