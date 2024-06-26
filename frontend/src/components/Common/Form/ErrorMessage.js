// src/components/Common/Form/ErrorMessage.js
import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message }) => (
    <p className="text-danger">{message}</p>
);

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

export default ErrorMessage;
