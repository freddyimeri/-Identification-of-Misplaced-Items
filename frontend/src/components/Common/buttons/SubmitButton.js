// src/components/Common/buttons/SubmitButton.js

import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/buttons/SubmitButton.css'; // Ensure this file imports the button styles

const SubmitButton = ({ label }) => {
    return (
        <button className="submit-button noselect" type="submit">
            <span className="text">{label}</span>
            <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
            </span>
        </button>
    );
};

SubmitButton.propTypes = {
    label: PropTypes.string.isRequired,
};

export default SubmitButton;
