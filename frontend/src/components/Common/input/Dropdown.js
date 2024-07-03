// src/components/Common/input/Dropdown.js

import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/input/Dropdown.css';

const Dropdown = ({ items, selectedItem, onItemSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        onItemSelect(item);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`dropdown-container ${className}`} ref={dropdownRef}>
            <div className={`dropdown-header ${isOpen ? 'open' : ''}`} onClick={toggleDropdown}>
                {selectedItem || "Select a number"}
                <span className={`icon ${isOpen ? 'open' : ''}`}>&#9662;</span>
            </div>
            <ul className={`dropdown-list ${isOpen ? 'open' : ''}`}>
                {items.map((item, index) => (
                    <li key={index} className="dropdown-item" onClick={() => handleItemClick(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
