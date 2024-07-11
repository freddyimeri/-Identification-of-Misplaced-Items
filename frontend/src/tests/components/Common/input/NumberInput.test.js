// src/tests/components/Common/input/NumberInput.test.js

/**
 * Test 1: renders the number input field with initial value - Ensure the NumberInput component renders correctly with the initial value.
 * Test 2: increments the value when the up button is clicked - Ensure the value increments when the up button is clicked.
 * Test 3: decrements the value when the down button is clicked - Ensure the value decrements when the down button is clicked.
 * Test 5: calls onValueChange with the correct value - Ensure the onValueChange callback is called with the correct value when the input changes.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import NumberInput from '../../../../components/Common/input/NumberInput';

describe('NumberInput Component', () => {
    // Clean up the DOM after each test to avoid interference
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Test to check if the NumberInput component renders correctly with the initial value
    it('renders the number input field with initial value', () => {
        render(<NumberInput value={5} min={0} max={10} step={1} onValueChange={() => { }} />);
        expect(screen.getByDisplayValue('5')).to.exist;
    });

    // Test to check if the value increments when the up button is clicked
    it('increments the value when the up button is clicked', () => {
        const onValueChangeSpy = sinon.spy();
        render(<NumberInput value={5} min={0} max={10} step={1} onValueChange={onValueChangeSpy} />);
        fireEvent.click(screen.getByRole('button', { name: '▲' }));
        expect(onValueChangeSpy.calledOnce).to.be.true;
        expect(onValueChangeSpy.calledWith(6)).to.be.true;
    });

    // Test to check if the value decrements when the down button is clicked
    it('decrements the value when the down button is clicked', () => {
        const onValueChangeSpy = sinon.spy();
        render(<NumberInput value={5} min={0} max={10} step={1} onValueChange={onValueChangeSpy} />);
        fireEvent.click(screen.getByRole('button', { name: '▼' }));
        expect(onValueChangeSpy.calledOnce).to.be.true;
        expect(onValueChangeSpy.calledWith(4)).to.be.true;
    });



    // Test to check if the onValueChange callback is called with the correct value when the input changes
    it('calls onValueChange with the correct value', () => {
        const onValueChangeSpy = sinon.spy();
        render(<NumberInput value={5} min={0} max={10} step={1} onValueChange={onValueChangeSpy} />);
        fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '7' } });
        expect(onValueChangeSpy.calledOnce).to.be.true;
        expect(onValueChangeSpy.calledWith(7)).to.be.true;
    });
});
