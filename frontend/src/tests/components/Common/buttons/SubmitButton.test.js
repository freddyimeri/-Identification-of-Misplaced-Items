// src/tests/components/Common/buttons/SubmitButton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import SubmitButton from '../../../../components/Common/buttons/SubmitButton';

describe('SubmitButton Component', () => {
    it('renders button with label', () => {
        render(<SubmitButton label="Submit" />);
        expect(screen.getByText(/Submit/i)).to.exist;
    });
});
