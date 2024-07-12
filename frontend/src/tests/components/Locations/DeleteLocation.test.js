// src/tests/components/Locations/DeleteLocation.test.js

/**
 * Test ID-> DL1: Ensure the DeleteLocation component renders correctly.
 * Test ID-> DL2: Ensure the deleteLocation API is called with the correct location ID.
 * Test ID-> DL3: Ensure the onDelete callback is triggered after a successful deletion.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DeleteLocation from '../../../components/Locations/DeleteLocation';
import * as locationApi from '../../../services/locationApi';

describe('DeleteLocation Component', () => {
    let deleteLocationStub;

    beforeEach(() => {
        // Mocking the deleteLocation service
        deleteLocationStub = sinon.stub(locationApi, 'deleteLocation').resolves({});
    });

    afterEach(() => {
        // Restore the original function
        deleteLocationStub.restore();
    });

    it('renders the DeleteLocation component correctly', () => {
        // Test ID-> DL1
        render(<DeleteLocation locationId="1" onDelete={() => { }} />);
        expect(screen.getByText(/Delete/i)).to.exist;
    });

    it('calls deleteLocation API with the correct location ID', async () => {
        // Test ID-> DL2
        render(<DeleteLocation locationId="1" onDelete={() => { }} />);

        fireEvent.click(screen.getByText(/Delete/i));

        await waitFor(() => {
            expect(deleteLocationStub.calledOnce).to.be.true;
            expect(deleteLocationStub.calledWith("1")).to.be.true;
        });
    });

    it('triggers onDelete callback after a successful deletion', async () => {
        // Test ID-> DL3
        const onDeleteSpy = sinon.spy();
        render(<DeleteLocation locationId="1" onDelete={onDeleteSpy} />);

        fireEvent.click(screen.getByText(/Delete/i));

        await waitFor(() => {
            expect(onDeleteSpy.calledOnce).to.be.true;
        });
    });
});
