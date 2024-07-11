// src/tests/components/Common/buttons/CancelButton.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CancelButton from '../../../../components/Common/buttons/CancelButton';

describe('CancelButton Component', () => {
    it('renders button with label', () => {
        render(<CancelButton label="Cancel" onClick={() => { }} />);
        expect(screen.getByText(/Cancel/i)).to.exist;
    });

    it('button click triggers onClick event', () => {
        const handleClick = sinon.spy();
        render(<CancelButton label="Cancel" onClick={handleClick} />);
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(handleClick.calledOnce).to.be.true;
    });
});
