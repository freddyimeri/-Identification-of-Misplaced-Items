// src/forms/UserProfile/ChangeEmailForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormContainer from '../../components/Common/Form/FormContainer';
import FormField from '../../components/Common/Form/FormField';
import SubmitButton from '../../components/Common/Form/SubmitButton';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';
import '../../styles/main.css';

const ChangeEmailForm = ({ onSubmit, onCancel }) => {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        onSubmit({ newEmail, password });
        setNewEmail('');
        setPassword('');
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormField
                label="New Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
            />
            <PasswordInputField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton label="Update Email" />
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </FormContainer>
    );
};

ChangeEmailForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ChangeEmailForm;
