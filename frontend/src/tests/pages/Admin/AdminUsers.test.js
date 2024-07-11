/**
 * @file AdminUsers.test.js
 * @path src/tests/pages/Admin/AdminUsers.test.js
 * @description This file contains the test suite for the AdminUsers component.
 * It ensures the component renders correctly, including fetching and displaying user data.
 * 
 * Test 1: renders the Users Activity title - Ensure the component renders the Users Activity title correctly.
 * Test 2: fetches and displays users - Ensure the component fetches and displays the users correctly.
 * Test 3: handles user deactivation - Ensure the component handles user deactivation correctly.
 * Test 4: handles user activation - Ensure the component handles user activation correctly.
 * Test 5: handles user deletion - Ensure the component handles user deletion correctly.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import AdminUsers from '../../../pages/Admin/AdminUsers';
import api from '../../../services/api';
import sinon from 'sinon';

describe('AdminUsers Component', () => {
    // Mock user data
    const users = [
        {
            id: 1,
            username: 'user1',
            email: 'user1@example.com',
            first_name: 'First',
            last_name: 'User',
            date_joined: '2022-01-01',
            last_login: '2022-01-02',
            is_active: true,
            is_staff: false,
            is_superuser: false,
            groups: [{ name: 'Group1' }],
        },
        // Add more mock users as needed
    ];

    let getStub, postStub, deleteStub, confirmStub;

    beforeEach(() => {
        // Stub API methods
        getStub = sinon.stub(api, 'get').resolves({ data: users });
        postStub = sinon.stub(api, 'post').resolves({});
        deleteStub = sinon.stub(api, 'delete').resolves({});

        // Mock window.confirm
        confirmStub = sinon.stub(window, 'confirm').returns(true);
    });

    afterEach(() => {
        // Restore API methods
        getStub.restore();
        postStub.restore();
        deleteStub.restore();

        // Restore window.confirm
        confirmStub.restore();
    });

    // Test 1: renders the Users Activity title
    it('renders the Users Activity title', () => {
        render(<AdminUsers />);

        // Check if the Users Activity title is rendered
        expect(screen.getByText('Users Activity')).to.exist;
    });

    // Test 2: fetches and displays users
    it('fetches and displays users', async () => {
        render(<AdminUsers />);

        // Check if the user data is fetched and displayed
        expect(await screen.findByText('user1')).to.exist;
    });

    // Test 3: handles user deactivation
    it('handles user deactivation', async () => {
        render(<AdminUsers />);

        // Simulate clicking the deactivate button
        const deactivateButton = await screen.findByText('Deactivate');
        fireEvent.click(deactivateButton);

        // Check if the API call was made and the user is deactivated
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.calledWith('/api/admin-app/users/deactivate/1/')).to.be.true;
    });

    // Test 4: handles user activation
    it('handles user activation', async () => {
        // Update mock user to be inactive
        users[0].is_active = false;
        getStub.resolves({ data: users });

        render(<AdminUsers />);

        // Simulate clicking the activate button
        const activateButton = await screen.findByText('Activate');
        fireEvent.click(activateButton);

        // Check if the API call was made and the user is activated
        expect(postStub.calledOnce).to.be.true;
        expect(postStub.calledWith('/api/admin-app/users/activate/1/')).to.be.true;
    });

    // Test 5: handles user deletion
    it('handles user deletion', async () => {
        render(<AdminUsers />);

        // Simulate clicking the delete button
        const deleteButton = await screen.findByText('Delete');
        fireEvent.click(deleteButton);

        // Check if the API call was made and the user is deleted
        expect(deleteStub.calledOnce).to.be.true;
        expect(deleteStub.calledWith('/api/admin-app/users/delete/1/')).to.be.true;
    });
});
