// src/components/Common/PasswordRequirements.js
import React from 'react';
import PropTypes from 'prop-types';

const PasswordRequirements = ({ password }) => (
    <small id="passwordHelpBlock" className="form-text text-muted">
        Your password must meet the following requirements:
        <div className={`password-requirement ${/.{8,}/.test(password) ? 'text-success' : 'text-muted'}`}>
            At least 8 characters
        </div>
        <div className={`password-requirement ${/[A-Z]/.test(password) ? 'text-success' : 'text-muted'}`}>
            At least one uppercase letter
        </div>
        <div className={`password-requirement ${/[a-z]/.test(password) ? 'text-success' : 'text-muted'}`}>
            At least one lowercase letter
        </div>
        <div className={`password-requirement ${/[0-9]/.test(password) ? 'text-success' : 'text-muted'}`}>
            At least one number
        </div>
    </small>
);

PasswordRequirements.propTypes = {
    password: PropTypes.string.isRequired
};

export default PasswordRequirements;
