// src/components/Common/Form/InputField.js
import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({ label, type, value, onChange, required }) => (
    <div className="form-group">
        <label>{label}</label>
        <input
            type={type}
            className="form-control"
            value={value}
            onChange={onChange}
            required={required}
        />
    </div>
);

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool
};

InputField.defaultProps = {
    required: false
};

export default InputField;
