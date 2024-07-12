// src/tests/components/Items/GetItems.test.js

/**
 * Test ID-> GI1: Ensure the GetItems component renders correctly.
 * Test ID-> GI2: Ensure the getItems API is called and items are fetched correctly.
 * Test ID-> GI3: Ensure the edit button calls the onEditItem callback.
 * Test ID-> GI4: Ensure the delete button calls the onDeleteItem callback.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import GetItems from '../../../components/Items/GetItems';
import * as itemApi from '../../../services/itemApi';

describe('GetItems Component', () => {
    let getItemsStub;

    beforeEach(() => {
        // Mocking the getItems service
        getItemsStub = sinon.stub(itemApi, 'getItems').resolves([
            { id: '1', name: 'Item 1' },
            { id: '2', name: 'Item 2' },
        ]);
    });

    afterEach(() => {
        // Restore the original function
        getItemsStub.restore();
    });

    it('renders the GetItems component correctly', async () => {
        // Test ID-> GI1
        render(<GetItems onEditItem={() => { }} onDeleteItem={() => { }} refresh={false} />);
        expect(screen.getByText(/Loading.../i)).to.exist; // Assuming you show a loading indicator

        await waitFor(() => {
            expect(screen.getByText(/Item 1/i)).to.exist;
            expect(screen.getByText(/Item 2/i)).to.exist;
        });
    });

    it('calls getItems API and fetches items correctly', async () => {
        // Test ID-> GI2
        render(<GetItems onEditItem={() => { }} onDeleteItem={() => { }} refresh={false} />);

        await waitFor(() => {
            expect(getItemsStub.calledOnce).to.be.true;
            expect(screen.getByText(/Item 1/i)).to.exist;
            expect(screen.getByText(/Item 2/i)).to.exist;
        });
    });

    it('calls onEditItem callback when edit button is clicked', async () => {
        // Test ID-> GI3
        const onEditItemSpy = sinon.spy();
        render(<GetItems onEditItem={onEditItemSpy} onDeleteItem={() => { }} refresh={false} />);

        await waitFor(() => {
            const editButton = screen.getAllByText(/Edit/i)[0];
            fireEvent.click(editButton);
            expect(onEditItemSpy.calledOnce).to.be.true;
        });
    });

    it('calls onDeleteItem callback when delete button is clicked', async () => {
        // Test ID-> GI4
        const onDeleteItemSpy = sinon.spy();
        render(<GetItems onEditItem={() => { }} onDeleteItem={onDeleteItemSpy} refresh={false} />);

        await waitFor(() => {
            const deleteButton = screen.getAllByText(/Delete/i)[0];
            fireEvent.click(deleteButton);
            expect(onDeleteItemSpy.calledOnce).to.be.true;
            expect(onDeleteItemSpy.calledWith('1')).to.be.true;
        });
    });
});
