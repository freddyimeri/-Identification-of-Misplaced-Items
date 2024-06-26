// src/components/Rules/AddRule.js
import React, { useState, useEffect } from 'react';
import { addRule } from '../../services/ruleApi';
import { getItems } from '../../services/itemApi';
import { getLocations } from '../../services/locationApi';
import '../../styles/main.css';
import '../../styles/_forms.css';
import '../../styles/checkbox/checkbox.css';
import '../../styles/_responsive.css';

const AddRule = ({ onRuleAdded }) => {
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [error, setError] = useState('');

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

    const handleItemChange = (itemId) => {
        setSelectedItem(itemId);
    };

    const handleLocationChange = (locationId) => {
        setSelectedLocations((prev) => {
            if (prev.includes(locationId)) {
                return prev.filter(id => id !== locationId);
            } else {
                return [...prev, locationId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addRule({ item: selectedItem, locations: selectedLocations });
            setSelectedItem('');
            setSelectedLocations([]);
            onRuleAdded();
        } catch (err) {
            setError('Error adding rule: ' + err.message);
        }
    };

    return (

        <div className="dashboard-card">
            <div className="card card-wide">
                <div className="card-body">
                    <h3 className="card-title">Add Rule</h3>

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
                                                onChange={() => handleItemChange(item.id)}
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
                                                onChange={() => handleLocationChange(location.id)}
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
                        <button type="submit" className="btn btn-primary">Add Rule</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRule;
