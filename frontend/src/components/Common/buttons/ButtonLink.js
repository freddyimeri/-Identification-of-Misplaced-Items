// src/components/Common/buttons/ButtonLink.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/buttons/ButtonLink.css';

const ButtonLink = ({ to, label, className, ...props }) => {
    return (
        <Link to={to} className={`button-64 ${className}`} {...props}>
            <span className="text">{label}</span>
        </Link>
    );
};

export default ButtonLink;
