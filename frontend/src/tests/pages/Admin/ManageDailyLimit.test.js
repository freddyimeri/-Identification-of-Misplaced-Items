/**
 * @file ManageDailyLimit.test.js
 * @path src/tests/pages/Admin/ManageDailyLimit.test.js
 * @description This file contains the test suite for the ManageDailyLimit component.
 * It ensures the component renders correctly, fetches initial data, handles user input, and saves updates.
 * 
 * Test 1: renders the form with initial values - Ensure the component renders the form with initial values correctly.
 * Test 2: fetches and displays initial daily limits - Ensure the component fetches and displays the initial daily limits correctly.
 * Test 3: handles image limit input change - Ensure the component handles the image limit input change correctly.
 * Test 4: handles video limit input change - Ensure the component handles the video limit input change correctly.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import ManageDailyLimit from '../../../pages/Admin/ManageDailyLimit';
import * as dailyLimitApi from '../../../services/dailyLimitApi';
import sinon from 'sinon';

describe('ManageDailyLimit Component', () => {
    let getStub, setStub;

    before(() => {
        // Mock window.alert
        global.alert = sinon.stub().returns(true);
    });

    beforeEach(() => {
        // Stub the API methods
        getStub = sinon.stub(dailyLimitApi, 'getDailyLimits').resolves({ daily_image_limit: 10, daily_video_limit: 5 });
        setStub = sinon.stub(dailyLimitApi, 'setDailyLimits').resolves({});
    });

    afterEach(() => {
        // Restore the API methods
        getStub.restore();
        setStub.restore();
    });

    // Test 1: renders the form with initial values
    it('renders the form with initial values', async () => {
        render(<ManageDailyLimit />);

        const imageLimitInput = await screen.findByLabelText(/Daily Image Limit/i);
        const videoLimitInput = await screen.findByLabelText(/Daily Video Limit/i);

        // Check if the form fields are rendered with initial values
        expect(imageLimitInput.value).to.equal('10');
        expect(videoLimitInput.value).to.equal('5');
    });

    // Test 2: fetches and displays initial daily limits
    it('fetches and displays initial daily limits', async () => {
        render(<ManageDailyLimit />);

        // Check if the API method was called
        expect(getStub.calledOnce).to.be.true;

        const imageLimitInput = await screen.findByLabelText(/Daily Image Limit/i);
        const videoLimitInput = await screen.findByLabelText(/Daily Video Limit/i);

        // Check if the initial values are displayed correctly
        expect(imageLimitInput.value).to.equal('10');
        expect(videoLimitInput.value).to.equal('5');
    });

    // Test 3: handles image limit input change
    it('handles image limit input change', async () => {
        render(<ManageDailyLimit />);

        const imageLimitInput = await screen.findByLabelText(/Daily Image Limit/i);
        fireEvent.change(imageLimitInput, { target: { value: '15' } });

        // Check if the value of the image limit input field is updated
        expect(imageLimitInput.value).to.equal('15');
    });

    // Test 4: handles video limit input change
    it('handles video limit input change', async () => {
        render(<ManageDailyLimit />);

        const videoLimitInput = await screen.findByLabelText(/Daily Video Limit/i);
        fireEvent.change(videoLimitInput, { target: { value: '10' } });

        // Check if the value of the video limit input field is updated
        expect(videoLimitInput.value).to.equal('10');
    });


});
