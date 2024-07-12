// src/tests/components/Rules/AddRule.test.js

/**
 * This file tests the AddRule component, ensuring it functions as expected.
 * 
 * Test ID-> AR1: Ensure the AddRule component renders correctly.
 * Test ID-> AR2: Ensure item checkboxes are rendered correctly based on fetched items.
 * Test ID-> AR3: Ensure location checkboxes are rendered correctly based on fetched locations.
 * Test ID-> AR4: Ensure error message is displayed when fetching items or locations fails.
 * Test ID-> AR5: Ensure selected item changes when an item checkbox is clicked.
 * Test ID-> AR6: Ensure selected locations change when location checkboxes are clicked.
 * Test ID-> AR7: Ensure addRule API is called with correct data on form submission.
 * Test ID-> AR8: Ensure onRuleAdded callback is triggered after a successful addition.
 * Test ID-> AR9: Ensure error message is displayed when adding a rule fails.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import AddRule from '../../../components/Rules/AddRule';
import * as ruleApi from '../../../services/ruleApi';
import * as itemApi from '../../../services/itemApi';
import * as locationApi from '../../../services/locationApi';

describe('AddRule Component', () => {
    let addRuleStub, getItemsStub, getLocationsStub;

    beforeEach(() => {
        // Mocking the API calls
        addRuleStub = sinon.stub(ruleApi, 'addRule').resolves();
        getItemsStub = sinon.stub(itemApi, 'getItems').resolves([{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }]);
        getLocationsStub = sinon.stub(locationApi, 'getLocations').resolves([{ id: '1', name: 'Location 1' }, { id: '2', name: 'Location 2' }]);
    });

    afterEach(() => {
        // Restore the original functions
        addRuleStub.restore();
        getItemsStub.restore();
        getLocationsStub.restore();
    });

    it('renders the AddRule component correctly', () => {
        // Test ID-> AR1
        render(<AddRule onRuleAdded={() => { }} />);
        expect(screen.getByRole('heading', { name: /Add Rule/i })).to.exist;
        expect(screen.getByRole('button', { name: /Add Rule/i })).to.exist;
    });

    it('renders item checkboxes correctly based on fetched items', async () => {
        // Test ID-> AR2
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            expect(screen.getByLabelText(/Item 1/i)).to.exist;
            expect(screen.getByLabelText(/Item 2/i)).to.exist;
        });
    });

    it('renders location checkboxes correctly based on fetched locations', async () => {
        // Test ID-> AR3
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            expect(screen.getByLabelText(/Location 1/i)).to.exist;
            expect(screen.getByLabelText(/Location 2/i)).to.exist;
        });
    });

    it('displays error message when fetching items or locations fails', async () => {
        // Test ID-> AR4
        getItemsStub.rejects(new Error('Failed to fetch items'));
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            expect(screen.getByText(/Error fetching items or locations/i)).to.exist;
        });
    });

    it('changes selected item when an item checkbox is clicked', async () => {
        // Test ID-> AR5
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText(/Item 1/i));
            expect(screen.getByLabelText(/Item 1/i).checked).to.be.true;
        });
    });

    it('changes selected locations when location checkboxes are clicked', async () => {
        // Test ID-> AR6
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText(/Location 1/i));
            expect(screen.getByLabelText(/Location 1/i).checked).to.be.true;
            fireEvent.click(screen.getByLabelText(/Location 2/i));
            expect(screen.getByLabelText(/Location 2/i).checked).to.be.true;
        });
    });

    it('calls addRule API with correct data on form submission', async () => {
        // Test ID-> AR7
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText(/Item 1/i));
            fireEvent.click(screen.getByLabelText(/Location 1/i));
            fireEvent.click(screen.getByLabelText(/Location 2/i));
        });
        fireEvent.submit(screen.getByRole('button', { name: /Add Rule/i }));

        await waitFor(() => {
            expect(addRuleStub.calledOnce).to.be.true;
            expect(addRuleStub.calledWith({ item: '1', locations: ['1', '2'] })).to.be.true;
        });
    });

    it('triggers onRuleAdded callback after a successful addition', async () => {
        // Test ID-> AR8
        const onRuleAddedSpy = sinon.spy();
        render(<AddRule onRuleAdded={onRuleAddedSpy} />);
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText(/Item 1/i));
            fireEvent.click(screen.getByLabelText(/Location 1/i));
        });
        fireEvent.submit(screen.getByRole('button', { name: /Add Rule/i }));

        await waitFor(() => {
            expect(onRuleAddedSpy.calledOnce).to.be.true;
        });
    });

    it('displays error message when adding a rule fails', async () => {
        // Test ID-> AR9
        addRuleStub.rejects(new Error('Failed to add rule'));
        render(<AddRule onRuleAdded={() => { }} />);
        await waitFor(() => {
            fireEvent.click(screen.getByLabelText(/Item 1/i));
            fireEvent.click(screen.getByLabelText(/Location 1/i));
        });
        fireEvent.submit(screen.getByRole('button', { name: /Add Rule/i }));

        await waitFor(() => {
            expect(screen.getByText(/Error adding rule: Failed to add rule/i)).to.exist;
        });
    });
});
