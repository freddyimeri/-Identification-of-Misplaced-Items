// src/components/UserProfile/DisplayInfoWithAction.js

import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../Common/buttons/ActionButton';

const DisplayInfoWithAction = ({ title, info, buttonLabel, onActionClick }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{info}</p>
                <ActionButton label={buttonLabel} onClick={onActionClick} />
            </div>
        </div>
    );
};

DisplayInfoWithAction.propTypes = {
    title: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onActionClick: PropTypes.func.isRequired,
};

export default DisplayInfoWithAction;
