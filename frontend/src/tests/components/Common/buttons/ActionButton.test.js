// tests/components/Common/buttons/ActionButton.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ActionButton from '../../../../components/Common/buttons/ActionButton';

describe('ActionButton Component', () => {
    it('renders button with label', () => {
        render(<ActionButton label="Click Me" />);
        expect(screen.getByText(/Click Me/i)).to.exist;
    });

    it('button click triggers onClick event', () => {
        const handleClick = sinon.spy();
        render(<ActionButton label="Click Me" onClick={handleClick} />);
        fireEvent.click(screen.getByText(/Click Me/i));
        expect(handleClick.calledOnce).to.be.true;
    });
});
