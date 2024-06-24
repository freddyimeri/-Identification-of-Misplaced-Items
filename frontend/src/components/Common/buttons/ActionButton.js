// src/components/Common/buttons/ActionButton.js

import React from 'react';
import '../../../styles/buttons/ActionButton.css';

const ActionButton = ({ label, onClick }) => {
    return (
        <button className="action-button" onClick={onClick}>
            {label}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </button>
    );
};

export default ActionButton;
