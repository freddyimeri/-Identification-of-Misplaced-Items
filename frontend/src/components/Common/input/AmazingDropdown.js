// src/components/Common/input/AmazingDropdown.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/input/AmazingDropdown.css';

const AmazingDropdown = ({ options, selectedOption, onSelect }) => {
    return (
        <div className="dropdown">
            <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                {selectedOption ? selectedOption : 'Select an option'}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {options.map(option => (
                    <button
                        key={option}
                        className="dropdown-item"
                        onClick={() => onSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AmazingDropdown;
