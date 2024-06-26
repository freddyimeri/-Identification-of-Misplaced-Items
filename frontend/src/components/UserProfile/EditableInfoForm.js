/* src/components/UserProfile/EditableInfoForm.js */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormField from '../Common/Form/FormField';
import PasswordInputField from '../Common/Password/PasswordInputField';
import SubmitButton from '../Common/buttons/SubmitButton';
import CancelButton from '../Common/buttons/CancelButton';

const EditableInfoForm = ({ label, type, onSubmit, onCancel, loading, error }) => {
    const [newInfo, setNewInfo] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ newInfo, password });
        setNewInfo('');
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit} >
            <FormField
                label={label}
                type={type}
                value={newInfo}
                onChange={(e) => setNewInfo(e.target.value)}
                required
            />
            <PasswordInputField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && <p className="text-danger">{error}</p>}
            <div className="form-buttons">
                <SubmitButton className="submit-button" label={loading ? 'Updating...' : `Update ${label}`} disabled={loading} />
                <CancelButton className="action-button" label="Cancel" onClick={onCancel} />
            </div>
        </form>
    );
};

EditableInfoForm.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};

export default EditableInfoForm;
