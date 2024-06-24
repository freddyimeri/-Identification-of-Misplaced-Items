// src/components/Common/Form/FormField.js
import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ label, type, value, onChange, required, placeholder, options, multiple }) => (
    <div className="form-group">
        <label>{label}</label>
        {type === 'select' ? (
            <select
                className="form-control"
                value={value}
                onChange={onChange}
                required={required}
                multiple={multiple}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                className="form-control"
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
            />
        )}
    </div>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
    })),
    multiple: PropTypes.bool,
};

FormField.defaultProps = {
    required: false,
    placeholder: '',
    options: [],
    multiple: false,
};

export default FormField;
