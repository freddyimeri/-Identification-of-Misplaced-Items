// src/components/Common/PasswordInputField.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PasswordRequirements from './PasswordRequirements';

const PasswordInputField = ({ label, value, onChange, requirements, showRequirements }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-group position-relative">
            <label>{label}</label>
            <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={value}
                onChange={onChange}
                required
            />
            <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? 'Hide' : 'Show'}
            </span>
            {showRequirements && <PasswordRequirements password={value} />}
        </div>
    );
};

PasswordInputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    requirements: PropTypes.object,
    showRequirements: PropTypes.bool,
};

export default PasswordInputField;
