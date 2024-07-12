// src/tests/components/Items/UpdateItem.test.js

/**
 * Test ID-> UI1: Ensure the UpdateItem component renders correctly.
 * Test ID-> UI2: Ensure the updateItem API is called with correct item ID and name.
 * Test ID-> UI3: Ensure the onUpdateCompleted callback is triggered after a successful update.
 * Test ID-> UI4: Ensure error message is displayed when update fails.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UpdateItem from '../../../components/Items/UpdateItem';
import * as itemApi from '../../../services/itemApi';

describe('UpdateItem Component', () => {
    let updateItemStub;

    beforeEach(() => {
        // Mocking the updateItem service
        updateItemStub = sinon.stub(itemApi, 'updateItem').resolves({});
    });

    afterEach(() => {
        // Restore the original function
        updateItemStub.restore();
    });

    it('renders the UpdateItem component correctly', () => {
        // Test ID-> UI1
        const item = { id: '1', name: 'Test Item' };
        render(<UpdateItem item={item} onUpdateCompleted={() => { }} />);
        expect(screen.getByDisplayValue(/Test Item/i)).to.exist;
    });

    it('calls updateItem API with correct item ID and name', async () => {
        // Test ID-> UI2
        const item = { id: '1', name: 'Test Item' };
        render(<UpdateItem item={item} onUpdateCompleted={() => { }} />);

        fireEvent.change(screen.getByDisplayValue(/Test Item/i), { target: { value: 'Updated Item' } });
        fireEvent.click(screen.getByText(/Update/i));

        await waitFor(() => {
            expect(updateItemStub.calledOnce).to.be.true;
            expect(updateItemStub.calledWith('1', { name: 'Updated Item' })).to.be.true;
        });
    });

    it('triggers onUpdateCompleted callback after a successful update', async () => {
        // Test ID-> UI3
        const item = { id: '1', name: 'Test Item' };
        const onUpdateCompletedSpy = sinon.spy();
        render(<UpdateItem item={item} onUpdateCompleted={onUpdateCompletedSpy} />);

        fireEvent.change(screen.getByDisplayValue(/Test Item/i), { target: { value: 'Updated Item' } });
        fireEvent.click(screen.getByText(/Update/i));

        await waitFor(() => {
            expect(onUpdateCompletedSpy.calledOnce).to.be.true;
        });
    });

    it('displays error message when update fails', async () => {
        // Test ID-> UI4
        updateItemStub.rejects(new Error('Update failed'));
        const item = { id: '1', name: 'Test Item' };
        render(<UpdateItem item={item} onUpdateCompleted={() => { }} />);

        fireEvent.change(screen.getByDisplayValue(/Test Item/i), { target: { value: 'Updated Item' } });
        fireEvent.click(screen.getByText(/Update/i));

        await waitFor(() => {
            expect(screen.getByText(/Error updating item: Update failed/i)).to.exist;
        });
    });
});
