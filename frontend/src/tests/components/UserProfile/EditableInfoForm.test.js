/**
 * Test 1: displays error message - Ensures an error message is displayed when passed as a prop.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import EditableInfoForm from '../../../components/UserProfile/EditableInfoForm';

describe('EditableInfoForm Component', () => {

    it('displays error message', () => {
        const errorMessage = 'Error updating info';
        render(
            <EditableInfoForm
                label="Email"
                type="email"
                onSubmit={() => { }}
                onCancel={() => { }}
                error={errorMessage}
            />
        );

        expect(screen.getByText(errorMessage)).to.exist;
    });
});
