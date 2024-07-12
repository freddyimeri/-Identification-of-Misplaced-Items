// src/tests/components/Items/DeleteItem.test.js

/**
 * Test ID-> DI1: Ensure the DeleteItem component renders correctly.
 * Test ID-> DI2: Ensure the deleteItem API is called with the correct item ID.
 * Test ID-> DI3: Ensure the onDelete callback is triggered after deletion.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DeleteItem from '../../../components/Items/DeleteItem';
import * as itemApi from '../../../services/itemApi';

describe('DeleteItem Component', () => {
    let deleteItemStub;

    beforeEach(() => {
        // Mocking the deleteItem service
        deleteItemStub = sinon.stub(itemApi, 'deleteItem').resolves({});
    });

    afterEach(() => {
        // Restore the original function
        deleteItemStub.restore();
    });

    it('renders the DeleteItem component correctly', () => {
        // Test ID-> DI1
        render(<DeleteItem itemId="1" onDelete={() => { }} />);
        expect(screen.getByText(/Delete/i)).to.exist;
    });

    it('calls deleteItem API with correct item ID', async () => {
        // Test ID-> DI2
        render(<DeleteItem itemId="1" onDelete={() => { }} />);
        const button = screen.getByText(/Delete/i);
        fireEvent.click(button);

        expect(deleteItemStub.calledOnce).to.be.true;
        expect(deleteItemStub.calledWith("1")).to.be.true;
    });

    it('triggers onDelete callback after deletion', async () => {
        // Test ID-> DI3
        const onDeleteSpy = sinon.spy();
        render(<DeleteItem itemId="1" onDelete={onDeleteSpy} />);
        const button = screen.getByText(/Delete/i);
        fireEvent.click(button);

        // Allow the async actions to complete
        await screen.findByText(/Delete/i);

        expect(onDeleteSpy.calledOnce).to.be.true;
    });
});
