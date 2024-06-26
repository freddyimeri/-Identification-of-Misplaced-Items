// src/components/Rules/UpdateRule.js

import React, { useState, useEffect } from 'react';
import { updateRule } from '../../services/ruleApi';
import { getItems } from '../../services/itemApi';
import { getLocations } from '../../services/locationApi';
import '../../styles/main.css'; // Ensure this is the correct path to main.css

const UpdateRule = ({ rule, onUpdateCompleted }) => {
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedItem, setSelectedItem] = useState(rule.item.id);
    const [selectedLocations, setSelectedLocations] = useState(rule.locations.map(location => location.id));
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsData = await getItems();
                const locationsData = await getLocations();
                setItems(itemsData);
                setLocations(locationsData);
            } catch (err) {
                setError('Error fetching items or locations');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updateRule(rule.id, { item: selectedItem, locations: selectedLocations });
            onUpdateCompleted();
        } catch (err) {
            setError('Error updating rule: ' + err.message);
        }
    };

    return (
        <div className="form-container">
            <h3>Update Rule</h3>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Item</label>
                    <div className="checkbox-container">
                        {items.map((item) => (
                            <label key={item.id} className="checkbox-wrapper-12">
                                <div className="cbx">
                                    <input
                                        type="checkbox"
                                        checked={selectedItem === item.id}
                                        onChange={() => setSelectedItem(item.id)}
                                    />
                                    <label></label>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                                        <path d="M2 8.36364L6.23077 12L13 2"></path>
                                    </svg>
                                </div>
                                <span>{item.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label>Locations</label>
                    <div className="checkbox-container">
                        {locations.map((location) => (
                            <label key={location.id} className="checkbox-wrapper-12">
                                <div className="cbx">
                                    <input
                                        type="checkbox"
                                        checked={selectedLocations.includes(location.id)}
                                        onChange={() => setSelectedLocations((prev) => {
                                            if (prev.includes(location.id)) {
                                                return prev.filter(id => id !== location.id);
                                            } else {
                                                return [...prev, location.id];
                                            }
                                        })}
                                    />
                                    <label></label>
                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
                                        <path d="M2 8.36364L6.23077 12L13 2"></path>
                                    </svg>
                                </div>
                                <span>{location.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Update Rule</button>
            </form>
        </div>
    );
};

export default UpdateRule;
