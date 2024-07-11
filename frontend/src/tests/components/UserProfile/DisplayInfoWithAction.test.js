/**
 * Test 1: renders title, info, and action button - Ensures the title, info, and action button are rendered.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DisplayInfoWithAction from '../../../components/UserProfile/DisplayInfoWithAction';

describe('DisplayInfoWithAction Component', () => {
    it('renders title, info, and action button', () => {
        render(
            <DisplayInfoWithAction
                title="Email"
                info="user@example.com"
                buttonLabel="Change Email"
                onActionClick={() => { }}
            />
        );

        expect(screen.getByText('Email')).to.exist;
        expect(screen.getByText('user@example.com')).to.exist;
        expect(screen.getByText('Change Email')).to.exist;
    });

});
