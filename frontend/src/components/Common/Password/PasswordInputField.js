// src/components/Common/Password/PasswordInputField.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PasswordRequirements from './PasswordRequirements';
import '../../../styles/main.css';

const PasswordInputField = ({ label, value, onChange, showRequirements }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="form-group position-relative">
            <label>{label}</label>
            <div className="input-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={value}
                    onChange={onChange}
                    required
                />
                <div className="input-group-append">
                    <span
                        className="input-group-text"
                        onClick={togglePasswordVisibility}
                        title={showPassword ? "Hide Password" : "Show Password"}
                    >
                        <i className={`fas fa-eye${showPassword ? '' : '-slash'}`}></i>
                    </span>
                </div>
            </div>
            {showRequirements && <PasswordRequirements password={value} />}
        </div>
    );
};

PasswordInputField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    showRequirements: PropTypes.bool,
};

PasswordInputField.defaultProps = {
    showRequirements: false,
};

export default PasswordInputField;
