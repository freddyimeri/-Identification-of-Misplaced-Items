// src/components/UserProfile/CurrentEmailCard.js
import React from 'react';

const CurrentEmailCard = ({ email, onChangeEmailClick }) => {
    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title">Current Email</h5>
                <p className="card-text">{email}</p>
                <button onClick={onChangeEmailClick} className="btn btn-primary">Change Email</button>
            </div>
        </div>
    );
};

export default CurrentEmailCard;
