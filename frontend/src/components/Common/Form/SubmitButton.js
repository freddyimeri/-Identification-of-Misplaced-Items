// src/components/Common/Form/SubmitButton.js
import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({ label, disabled }) => (
    <button type="submit" className="btn btn-primary btn-block" disabled={disabled}>{label}</button>
);

SubmitButton.propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};

SubmitButton.defaultProps = {
    disabled: false,
};

export default SubmitButton;
