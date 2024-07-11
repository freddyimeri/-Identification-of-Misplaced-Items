/**
 * Test 1: renders the rules list - Ensures the rules list is rendered with fetched rules.
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import GetRules from '../../../components/Rules/GetRules';
import * as ruleApi from '../../../services/ruleApi';

describe('GetRules Component', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('renders the rules list', async () => {
        const rules = [
            { id: 1, item: { name: 'Item 1' }, locations: [{ name: 'Location 1' }, { name: 'Location 2' }] },
            { id: 2, item: { name: 'Item 2' }, locations: [{ name: 'Location 3' }] }
        ];
        sinon.stub(ruleApi, 'getRules').resolves(rules);

        render(<GetRules onEditRule={() => { }} onDeleteRule={() => { }} refresh={false} />);

        await waitFor(() => {
            rules.forEach(rule => {
                expect(screen.getByText(rule.item.name)).to.exist;
                expect(screen.getByText(rule.locations.map(loc => loc.name).join(', '))).to.exist;
            });
        });
    });


});
