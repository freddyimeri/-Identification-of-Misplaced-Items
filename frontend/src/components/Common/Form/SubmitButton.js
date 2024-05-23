// src/components/Common/SubmitButton.js
import React from 'react';
import PropTypes from 'prop-types';

const SubmitButton = ({ label }) => (
    <button type="submit" className="btn btn-primary btn-block">{label}</button>
);

SubmitButton.propTypes = {
    label: PropTypes.string.isRequired
};

export default SubmitButton;
