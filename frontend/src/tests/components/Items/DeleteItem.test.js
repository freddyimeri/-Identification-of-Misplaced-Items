/**
 * Test 1: renders the delete button - Ensures the delete button is rendered correctly.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import DeleteItem from '../../../components/Items/DeleteItem';
import * as itemApi from '../../../services/itemApi';

describe('DeleteItem Component', () => {
    it('renders the delete button', () => {
        render(<DeleteItem />);
        expect(screen.getByRole('button', { name: /delete/i })).to.exist;
    });

});
