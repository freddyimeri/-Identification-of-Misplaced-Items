// src/components/Common/Form/FormContainer.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

const FormContainer = ({ children, onSubmit }) => {
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await onSubmit(e);  // Pass the event object to the onSubmit function
        } catch (err) {
            setError(err.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-form">
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit}>
                {children}
            </form>
        </div>
    );
};

FormContainer.propTypes = {
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default FormContainer;
