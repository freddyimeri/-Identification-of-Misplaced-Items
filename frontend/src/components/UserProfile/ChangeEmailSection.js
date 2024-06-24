// src/components/UserProfile/ChangeEmailSection.js

import React, { useState } from 'react';
import ChangeEmailForm from '../../forms/UserProfile/ChangeEmailForm';

const ChangeEmailSection = ({ currentEmail, onUpdateEmail }) => {
    const [showChangeEmailForm, setShowChangeEmailForm] = useState(false);

    return (
        <div>
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Current Email</h3>
                    <p className="card-text">{currentEmail}</p>
                    <button className="btn btn-primary" onClick={() => setShowChangeEmailForm(true)}>Change Email</button>
                </div>
            </div>
            {showChangeEmailForm && (
                <ChangeEmailForm
                    onSubmit={onUpdateEmail}
                    onCancel={() => setShowChangeEmailForm(false)}
                />
            )}
        </div>
    );
};

export default ChangeEmailSection;
