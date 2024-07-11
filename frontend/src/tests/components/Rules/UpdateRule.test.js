/**
 * Test 1: renders the form with items and locations - Ensures the form renders correctly with fetched items and locations.
 * Test 2: displays error message on fetch failure - Ensures an error message is displayed if fetching items or locations fails.
 * Test 3: displays error message on updateRule failure - Ensures an error message is displayed if updating a rule fails.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UpdateRule from '../../../components/Rules/UpdateRule';
import * as itemApi from '../../../services/itemApi';
import * as locationApi from '../../../services/locationApi';
import * as ruleApi from '../../../services/ruleApi';

describe('UpdateRule Component', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('renders the form with items and locations', async () => {
        const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
        const locations = [{ id: 1, name: 'Location 1' }, { id: 2, name: 'Location 2' }];
        const rule = { id: 1, item: { id: 1, name: 'Item 1' }, locations: [{ id: 1, name: 'Location 1' }] };
        sinon.stub(itemApi, 'getItems').resolves(items);
        sinon.stub(locationApi, 'getLocations').resolves(locations);

        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);

        await waitFor(() => {
            items.forEach(item => {
                expect(screen.getByText(item.name)).to.exist;
            });
            locations.forEach(location => {
                expect(screen.getByText(location.name)).to.exist;
            });
        });
    });


    it('displays error message on fetch failure', async () => {
        const rule = { id: 1, item: { id: 1, name: 'Item 1' }, locations: [{ id: 1, name: 'Location 1' }] };
        const errorMessage = 'Error fetching items or locations';
        sinon.stub(itemApi, 'getItems').rejects(new Error(errorMessage));
        sinon.stub(locationApi, 'getLocations').rejects(new Error(errorMessage));

        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);

        await waitFor(() => {
            expect(screen.getByText(new RegExp(errorMessage, 'i'))).to.exist;
        });
    });

    it('displays error message on updateRule failure', async () => {
        const items = [{ id: 1, name: 'Item 1' }];
        const locations = [{ id: 1, name: 'Location 1' }];
        const rule = { id: 1, item: { id: 1, name: 'Item 1' }, locations: [{ id: 1, name: 'Location 1' }] };
        sinon.stub(itemApi, 'getItems').resolves(items);
        sinon.stub(locationApi, 'getLocations').resolves(locations);
        const errorMessage = 'Error updating rule';
        sinon.stub(ruleApi, 'updateRule').rejects(new Error(errorMessage));

        render(<UpdateRule rule={rule} onUpdateCompleted={() => { }} />);

        await waitFor(() => {
            fireEvent.submit(screen.getByRole('button', { name: /update rule/i }));
        });

        await waitFor(() => {
            expect(screen.getByText(new RegExp(errorMessage, 'i'))).to.exist;
        });
    });
});
