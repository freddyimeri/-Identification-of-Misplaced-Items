// src/tests/components/UserProfile/ChangeInfoSection.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ChangeInfoSection from '../../../components/UserProfile/ChangeInfoSection';

describe('ChangeInfoSection Component', () => {
    const title = "User Info";
    const infoLabel = "Info";
    const currentInfo = "Current Information";
    const onUpdateInfo = sinon.spy();

    beforeEach(() => {
        render(
            <ChangeInfoSection
                title={title}
                infoLabel={infoLabel}
                currentInfo={currentInfo}
                onUpdateInfo={onUpdateInfo}
            />
        );
    });

    it('shows the form when action button is clicked', async () => {
        fireEvent.click(screen.getByText(/Change Info/i));

        await waitFor(() => screen.getByRole('form'));

        expect(screen.getByRole('form')).to.exist;
    });

    it('calls onUpdateInfo with correct data on form submission', async () => {
        fireEvent.click(screen.getByText(/Change Info/i));
        await waitFor(() => screen.getByRole('form'));

        fireEvent.change(screen.getByLabelText(/New Info/i), { target: { value: 'New Information' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.submit(screen.getByRole('form'));

        await waitFor(() => {
            expect(onUpdateInfo.calledOnce).to.be.true;
            expect(onUpdateInfo.calledWith({ newInfo: 'New Information', password: 'password' })).to.be.true;
        });
    });

    it('hides the form when cancel button is clicked', async () => {
        fireEvent.click(screen.getByText(/Change Info/i));
        await waitFor(() => screen.getByRole('form'));

        fireEvent.click(screen.getByText(/Cancel/i));
        await waitFor(() => {
            expect(screen.queryByRole('form')).to.not.exist;
        });
    });
});
