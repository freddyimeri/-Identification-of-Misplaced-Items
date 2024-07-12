// src/tests/components/Locations/GetLocations.test.js

/**
 * Test ID-> GL1: Ensure the GetLocations component renders correctly.
 * Test ID-> GL2: Ensure locations are fetched and displayed correctly.
 * Test ID-> GL3: Ensure the onEditLocation callback is triggered correctly.
 * Test ID-> GL4: Ensure the onDeleteLocation callback is triggered correctly.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import GetLocations from '../../../components/Locations/GetLocations';
import * as locationApi from '../../../services/locationApi';

describe('GetLocations Component', () => {
    let getLocationsStub;

    beforeEach(() => {
        // Mocking the getLocations service
        getLocationsStub = sinon.stub(locationApi, 'getLocations').resolves([
            { id: '1', name: 'Location 1' },
            { id: '2', name: 'Location 2' },
        ]);
    });

    afterEach(() => {
        // Restore the original function
        getLocationsStub.restore();
    });

    it('renders the GetLocations component correctly', () => {
        // Test ID-> GL1
        render(<GetLocations onEditLocation={() => { }} onDeleteLocation={() => { }} refresh={false} />);
        expect(screen.getByText(/Locations List/i)).to.exist;
    });

    it('fetches and displays locations correctly', async () => {
        // Test ID-> GL2
        render(<GetLocations onEditLocation={() => { }} onDeleteLocation={() => { }} refresh={false} />);

        await waitFor(() => {
            expect(screen.getByText(/Location 1/i)).to.exist;
            expect(screen.getByText(/Location 2/i)).to.exist;
        });
    });

    it('triggers onEditLocation callback correctly', async () => {
        // Test ID-> GL3
        const onEditLocationSpy = sinon.spy();
        render(<GetLocations onEditLocation={onEditLocationSpy} onDeleteLocation={() => { }} refresh={false} />);

        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/Edit/i)[0]);
        });

        expect(onEditLocationSpy.calledOnce).to.be.true;
        expect(onEditLocationSpy.calledWith({ id: '1', name: 'Location 1' })).to.be.true;
    });

    it('triggers onDeleteLocation callback correctly', async () => {
        // Test ID-> GL4
        const onDeleteLocationSpy = sinon.spy();
        render(<GetLocations onEditLocation={() => { }} onDeleteLocation={onDeleteLocationSpy} refresh={false} />);

        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/Delete/i)[0]);
        });

        expect(onDeleteLocationSpy.calledOnce).to.be.true;
        expect(onDeleteLocationSpy.calledWith('1')).to.be.true;
    });
});
