// src/tests/components/Items/AddItem.test.js

/**
 * Test ID-> AI1: Ensure the AddItem component renders correctly.
 * Test ID-> AI2: Ensure the input field can capture user input.
 * Test ID-> AI3: Ensure the form submission calls addItem API.
 * Test ID-> AI4: Ensure the form submission triggers onItemAdded callback.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import AddItem from '../../../components/Items/AddItem';
import * as itemApi from '../../../services/itemApi';

describe('AddItem Component', () => {
    let addItemStub;

    beforeEach(() => {
        // Mocking the addItem service
        addItemStub = sinon.stub(itemApi, 'addItem').resolves({});
    });

    afterEach(() => {
        // Restore the original function
        addItemStub.restore();
    });

    it('renders the AddItem component correctly', () => {
        // Test ID-> AI1
        render(<AddItem onItemAdded={() => { }} />);
        expect(screen.getByText(/Submit/i)).to.exist;
        expect(screen.getByLabelText(/Name/i)).to.exist;
    });

    it('captures user input correctly', () => {
        // Test ID-> AI2
        render(<AddItem onItemAdded={() => { }} />);
        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'NewItem' } });
        expect(input.value).to.equal('NewItem');
    });

    it('calls addItem API on form submission', async () => {
        // Test ID-> AI3
        render(<AddItem onItemAdded={() => { }} />);
        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'NewItem' } });

        const button = screen.getByText(/Submit/i);
        fireEvent.click(button);

        expect(addItemStub.calledOnce).to.be.true;
        expect(addItemStub.calledWith({ name: 'NewItem' })).to.be.true;
    });

    it('triggers onItemAdded callback on form submission', async () => {
        // Test ID-> AI4
        const onItemAddedSpy = sinon.spy();
        render(<AddItem onItemAdded={onItemAddedSpy} />);
        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'NewItem' } });

        const button = screen.getByText(/Submit/i);
        fireEvent.click(button);

        // Allow the async actions to complete
        await screen.findByText(/Submit/i);

        expect(onItemAddedSpy.calledOnce).to.be.true;
    });
});
