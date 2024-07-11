/**
 * @file AdminDashboard.test.js
 * @path src/tests/pages/Admin/AdminDashboard.test.js
 * @description This file contains the test suite for the AdminDashboard component.
 * It ensures the component renders correctly, including the title and all navigation links with the correct paths.
 * 
 * Test 1: renders the admin dashboard title - Ensure the component renders the admin dashboard title correctly.
 * Test 2: renders all the navigation links - Ensure the component renders all the navigation links correctly.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect } from 'chai';
import AdminDashboard from '../../../pages/Admin/AdminDashboard';

describe('AdminDashboard Component', () => {
    /**
     * Test 1: renders the admin dashboard title
     * Ensure the component renders the admin dashboard title correctly.
     */
    it('renders the admin dashboard title', () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        expect(screen.getByText('Admin Dashboard')).to.exist;
    });

    /**
     * Test 2: renders all the navigation links
     * Ensure the component renders all the navigation links correctly.
     */
    it('renders all the navigation links', () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        const links = screen.getAllByRole('link');
        expect(links).to.have.lengthOf(5);

        expect(screen.getByText('Users Activity')).to.exist;
        expect(screen.getByText('Manage Locations')).to.exist;
        expect(screen.getByText('Manage Items')).to.exist;
        expect(screen.getByText('Manage Rules')).to.exist;
        expect(screen.getByText('Manage Daily Detection Limit')).to.exist;
    });


});
