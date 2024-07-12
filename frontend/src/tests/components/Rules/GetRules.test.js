// src/tests/components/Rules/GetRules.test.js

/**
 * This file tests the GetRules component, ensuring it functions as expected.
 * 
 * Test ID-> GR1: Ensure the GetRules component renders correctly.
 * Test ID-> GR2: Ensure rules are rendered correctly based on fetched data.
 * Test ID-> GR3: Ensure error message is displayed when fetching rules fails.
 * Test ID-> GR4: Ensure deleteRule API is called with correct data on delete button click.
 * Test ID-> GR5: Ensure onDeleteRule callback is triggered after a successful deletion.
 * Test ID-> GR6: Ensure onEditRule callback is triggered correctly when edit button is clicked.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import GetRules from '../../../components/Rules/GetRules';
import * as ruleApi from '../../../services/ruleApi';

describe('GetRules Component', () => {
    let getRulesStub, deleteRuleStub;

    beforeEach(() => {
        // Mocking the API calls
        getRulesStub = sinon.stub(ruleApi, 'getRules').resolves([
            { id: '1', item: { name: 'Item 1' }, locations: [{ name: 'Location 1' }] },
            { id: '2', item: { name: 'Item 2' }, locations: [{ name: 'Location 2' }] }
        ]);
        deleteRuleStub = sinon.stub(ruleApi, 'deleteRule').resolves();
    });

    afterEach(() => {
        // Restore the original functions
        getRulesStub.restore();
        deleteRuleStub.restore();
    });

    it('renders the GetRules component correctly', async () => {
        // Test ID-> GR1
        render(<GetRules onEditRule={() => { }} onDeleteRule={() => { }} refresh={false} />);
        expect(screen.getByRole('heading', { name: /Rules List/i })).to.exist;
        await waitFor(() => {
            expect(screen.getByText(/Item 1/i)).to.exist;
            expect(screen.getByText(/Location 1/i)).to.exist;
        });
    });

    it('renders rules correctly based on fetched data', async () => {
        // Test ID-> GR2
        render(<GetRules onEditRule={() => { }} onDeleteRule={() => { }} refresh={false} />);
        await waitFor(() => {
            expect(screen.getByText(/Item 1/i)).to.exist;
            expect(screen.getByText(/Location 1/i)).to.exist;
            expect(screen.getByText(/Item 2/i)).to.exist;
            expect(screen.getByText(/Location 2/i)).to.exist;
        });
    });

    it('displays error message when fetching rules fails', async () => {
        // Test ID-> GR3
        getRulesStub.rejects(new Error('Failed to fetch rules'));
        render(<GetRules onEditRule={() => { }} onDeleteRule={() => { }} refresh={false} />);
        await waitFor(() => {
            expect(screen.getByText(/Error fetching rules/i)).to.exist;
        });
    });

    it('calls deleteRule API with correct data on delete button click', async () => {
        // Test ID-> GR4
        const onDeleteRuleSpy = sinon.spy();
        render(<GetRules onEditRule={() => { }} onDeleteRule={onDeleteRuleSpy} refresh={false} />);
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/Delete/i)[0]);
        });
        await waitFor(() => {
            expect(deleteRuleStub.calledOnce).to.be.true;
            expect(deleteRuleStub.calledWith('1')).to.be.true;
        });
    });

    it('triggers onDeleteRule callback after a successful deletion', async () => {
        // Test ID-> GR5
        const onDeleteRuleSpy = sinon.spy();
        render(<GetRules onEditRule={() => { }} onDeleteRule={onDeleteRuleSpy} refresh={false} />);
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/Delete/i)[0]);
        });
        await waitFor(() => {
            expect(onDeleteRuleSpy.calledOnce).to.be.true;
        });
    });

    it('triggers onEditRule callback correctly when edit button is clicked', async () => {
        // Test ID-> GR6
        const onEditRuleSpy = sinon.spy();
        render(<GetRules onEditRule={onEditRuleSpy} onDeleteRule={() => { }} refresh={false} />);
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/Edit/i)[0]);
        });
        await waitFor(() => {
            expect(onEditRuleSpy.calledOnce).to.be.true;
            expect(onEditRuleSpy.calledWith({ id: '1', item: { name: 'Item 1' }, locations: [{ name: 'Location 1' }] })).to.be.true;
        });
    });
});
