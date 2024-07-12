// src/tests/components/Locations/UpdateLocation.test.js

/**
 * This file tests the UpdateLocation component, ensuring it functions as expected.
 * 
 * Test ID-> UL1: Ensure the UpdateLocation component renders correctly.
 * Test ID-> UL2: Ensure input field is pre-filled with the location's name.
 * Test ID-> UL3: Ensure input value changes when the user types.
 * Test ID-> UL4: Ensure the updateLocation API is called with correct data on form submission.
 * Test ID-> UL5: Ensure onUpdateCompleted callback is triggered after a successful update.
 * Test ID-> UL6: Ensure error message is displayed when update fails.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UpdateLocation from '../../../components/Locations/UpdateLocation';
import * as locationApi from '../../../services/locationApi';

describe('UpdateLocation Component', () => {
    let updateLocationStub;

    beforeEach(() => {
        // Mocking the updateLocation service
        updateLocationStub = sinon.stub(locationApi, 'updateLocation').resolves();
    });

    afterEach(() => {
        // Restore the original function
        updateLocationStub.restore();
    });

    it('renders the UpdateLocation component correctly', () => {
        // Test ID-> UL1
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={() => { }} />);
        expect(screen.getByText(/Update Location/i)).to.exist;
    });

    it('pre-fills the input field with the location\'s name', () => {
        // Test ID-> UL2
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={() => { }} />);
        expect(screen.getByDisplayValue(/Test Location/i)).to.exist;
    });

    it('changes input value when user types', () => {
        // Test ID-> UL3
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={() => { }} />);
        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'Updated Location' } });
        expect(input.value).to.equal('Updated Location');
    });

    it('calls updateLocation API with correct data on form submission', async () => {
        // Test ID-> UL4
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={() => { }} />);
        const input = screen.getByLabelText(/Name/i);
        fireEvent.change(input, { target: { value: 'Updated Location' } });
        fireEvent.submit(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() => {
            expect(updateLocationStub.calledOnce).to.be.true;
            expect(updateLocationStub.calledWith('1', { name: 'Updated Location' })).to.be.true;
        });
    });

    it('triggers onUpdateCompleted callback after a successful update', async () => {
        // Test ID-> UL5
        const onUpdateCompletedSpy = sinon.spy();
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={onUpdateCompletedSpy} />);
        fireEvent.submit(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() => {
            expect(onUpdateCompletedSpy.calledOnce).to.be.true;
        });
    });

    it('displays error message when update fails', async () => {
        // Test ID-> UL6
        updateLocationStub.rejects(new Error('Update failed'));
        render(<UpdateLocation location={{ id: '1', name: 'Test Location' }} onUpdateCompleted={() => { }} />);
        fireEvent.submit(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() => {
            expect(screen.getByText(/Error updating location: Update failed/i)).to.exist;
        });
    });
});
