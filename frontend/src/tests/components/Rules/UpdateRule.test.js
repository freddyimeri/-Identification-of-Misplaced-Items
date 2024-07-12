// src/tests/components/Rules/UpdateRule.test.js

/**
 * This file tests the UpdateRule component, ensuring it functions as expected.
 * 
 * Test ID-> UR1: Ensure the UpdateRule component renders correctly.
 * Test ID-> UR2: Ensure items and locations are fetched and rendered correctly.
 * Test ID-> UR3: Ensure error message is displayed when fetching items or locations fails.
 * Test ID-> UR4: Ensure input values change when user interacts with the checkboxes.
 * Test ID-> UR5: Ensure updateRule API is called with correct data on form submission.
 * Test ID-> UR6: Ensure onUpdateCompleted callback is triggered after a successful update.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UpdateRule from '../../../components/Rules/UpdateRule';
import * as ruleApi from '../../../services/ruleApi';
import * as itemApi from '../../../services/itemApi';
import * as locationApi from '../../../services/locationApi';

describe('UpdateRule Component', () => {
    let updateRuleStub, getItemsStub, getLocationsStub;
    const rule = {
        id: '1',
        item: { id: 'item1', name: 'Item 1' },
        locations: [{ id: 'loc1', name: 'Location 1' }, { id: 'loc2', name: 'Location 2' }]
    };

    beforeEach(() => {
        // Mocking the API calls
        updateRuleStub = sinon.stub(ruleApi, 'updateRule').resolves();
        getItemsStub = sinon.stub(itemApi, 'getItems').resolves([
            { id: 'item1', name: 'Item 1' },
            { id: 'item2', name: 'Item 2' }
        ]);
        getLocationsStub = sinon.stub(locationApi, 'getLocations').resolves([
            { id: 'loc1', name: 'Location 1' },
            { id: 'loc2', name: 'Location 2' },
            { id: 'loc3', name: 'Location 3' }
        ]);
    });

    afterEach(() => {
        // Restore the original functions
        updateRuleStub.restore();
        getItemsStub.restore();
        getLocationsStub.restore();
    });

    it('renders the UpdateRule component correctly', async () => {
        // Test ID-> UR1
        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);
        expect(screen.getByRole('heading', { name: /Update Rule/i })).to.exist;
        await waitFor(() => {
            expect(screen.getByText(/Item 1/i)).to.exist;
            expect(screen.getByText(/Location 1/i)).to.exist;
        });
    });

    it('renders items and locations correctly based on fetched data', async () => {
        // Test ID-> UR2
        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);
        await waitFor(() => {
            expect(screen.getByText(/Item 2/i)).to.exist;
            expect(screen.getByText(/Location 3/i)).to.exist;
        });
    });

    it('displays error message when fetching items or locations fails', async () => {
        // Test ID-> UR3
        getItemsStub.rejects(new Error('Failed to fetch items'));
        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);
        await waitFor(() => {
            expect(screen.getByText(/Error fetching items or locations/i)).to.exist;
        });
    });

    it('changes input values when user interacts with the checkboxes', async () => {
        // Test ID-> UR4
        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);
        await waitFor(() => {
            const itemCheckbox = screen.getByLabelText(/Item 2/i);
            fireEvent.click(itemCheckbox);
            expect(itemCheckbox.checked).to.be.true;

            const locationCheckbox = screen.getByLabelText(/Location 3/i);
            fireEvent.click(locationCheckbox);
            expect(locationCheckbox.checked).to.be.true;
        });
    });

    it('calls updateRule API with correct data on form submission', async () => {
        // Test ID-> UR5
        const onUpdateCompletedSpy = sinon.spy();
        render(<UpdateRule rule={rule} onUpdateCompleted={onUpdateCompletedSpy} />);
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Update Rule/i }));
        });
        await waitFor(() => {
            expect(updateRuleStub.calledOnce).to.be.true;
            expect(updateRuleStub.calledWith('1', { item: 'item1', locations: ['loc1', 'loc2'] })).to.be.true;
        });
    });

    it('triggers onUpdateCompleted callback after a successful update', async () => {
        // Test ID-> UR6
        const onUpdateCompletedSpy = sinon.spy();
        render(<UpdateRule rule={rule} onUpdateCompleted={onUpdateCompletedSpy} />);
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button', { name: /Update Rule/i }));
        });
        await waitFor(() => {
            expect(onUpdateCompletedSpy.calledOnce).to.be.true;
        });
    });
});
