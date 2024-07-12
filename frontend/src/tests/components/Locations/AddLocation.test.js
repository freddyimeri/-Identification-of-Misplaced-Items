// src/tests/components/Locations/AddLocation.test.js

/**
 * Test ID-> AL1: Ensure the AddLocation component renders correctly.
 * Test ID-> AL2: Ensure the addLocation API is called with correct location name.
 * Test ID-> AL3: Ensure the onLocationAdded callback is triggered after a successful addition.
 * Test ID-> AL4: Ensure the input value changes when user types.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import AddLocation from '../../../components/Locations/AddLocation';
import * as locationApi from '../../../services/locationApi';

describe('AddLocation Component', () => {
    let addLocationStub;

    beforeEach(() => {
        // Mocking the addLocation service
        addLocationStub = sinon.stub(locationApi, 'addLocation').resolves({});
    });

    afterEach(() => {
        // Restore the original function
        addLocationStub.restore();
    });

    it('renders the AddLocation component correctly', () => {
        // Test ID-> AL1
        render(<AddLocation onLocationAdded={() => { }} />);
        expect(screen.getByText(/Add Location/i)).to.exist;
        expect(screen.getByLabelText(/Name/i)).to.exist;
        expect(screen.getByText(/Submit/i)).to.exist;
    });

    it('calls addLocation API with correct location name', async () => {
        // Test ID-> AL2
        render(<AddLocation onLocationAdded={() => { }} />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Location' } });
        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(addLocationStub.calledOnce).to.be.true;
            expect(addLocationStub.calledWith({ name: 'New Location' })).to.be.true;
        });
    });

    it('triggers onLocationAdded callback after a successful addition', async () => {
        // Test ID-> AL3
        const onLocationAddedSpy = sinon.spy();
        render(<AddLocation onLocationAdded={onLocationAddedSpy} />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Location' } });
        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(onLocationAddedSpy.calledOnce).to.be.true;
        });
    });

    it('changes input value when user types', () => {
        // Test ID-> AL4
        render(<AddLocation onLocationAdded={() => { }} />);

        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'New Location' } });

        expect(input.value).to.equal('New Location');
    });
});
