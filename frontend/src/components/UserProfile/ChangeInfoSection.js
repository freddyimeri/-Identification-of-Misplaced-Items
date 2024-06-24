// src/components/UserProfile/ChangeInfoSection.js
import React, { useState } from 'react';
import DisplayInfoWithAction from './DisplayInfoWithAction';
import EditableInfoForm from './EditableInfoForm';

const ChangeInfoSection = ({ title, infoLabel, currentInfo, onUpdateInfo }) => {
    const [showForm, setShowForm] = useState(false);

    const handleActionClick = () => {
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const handleSubmit = (data) => {
        onUpdateInfo(data);
        setShowForm(false);
    };

    return (
        <div className="settings-section">
            <DisplayInfoWithAction
                title={title}
                info={currentInfo}
                buttonLabel={`Change ${infoLabel}`}
                onActionClick={handleActionClick}
            />
            {showForm && (
                <EditableInfoForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ChangeInfoSection;
