// src/tests/components/Common/input/Dropdown.test.js

/**
 * Test 1: renders the dropdown with default text - Ensure the Dropdown component renders correctly with default text.
 * Test 2: calls onItemSelect when an item is clicked - Ensure the onItemSelect callback is called when an item is selected.
 */

// This test suite validates the functionality of the Dropdown component, ensuring it renders correctly, toggles the dropdown list, calls the onItemSelect callback, and closes when clicking outside.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Dropdown from '../../../../components/Common/input/Dropdown';

describe('Dropdown Component', () => {
    // Clean up the DOM after each test to avoid interference
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // Test to check if the Dropdown component renders correctly with default text
    it('renders the dropdown with default text', () => {
        render(<Dropdown items={[]} selectedItem="" onItemSelect={() => { }} />);

        // Ensure the dropdown header is displayed with default text
        expect(screen.getByText(/Select a number/i)).to.exist;
    });


    // Test to check if the onItemSelect callback is called when an item is selected
    it('calls onItemSelect when an item is clicked', () => {
        const onItemSelectSpy = sinon.spy();
        render(<Dropdown items={['Item 1', 'Item 2']} selectedItem="" onItemSelect={onItemSelectSpy} />);

        const dropdownHeader = screen.getByText(/Select a number/i);

        // Click the dropdown header to open the list
        fireEvent.click(dropdownHeader);

        // Click an item in the list
        fireEvent.click(screen.getByText(/Item 1/i));

        // Ensure the onItemSelect callback is called
        expect(onItemSelectSpy.calledOnce).to.be.true;
        expect(onItemSelectSpy.calledWith('Item 1')).to.be.true;
    });


});
