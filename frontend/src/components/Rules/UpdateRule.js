import React, { useState, useEffect } from 'react';
import { updateRule } from '../../services/ruleApi';
import { getItems } from '../../services/itemApi';
import { getLocations } from '../../services/locationApi';
import './UpdateRule.css';

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
        <div className="update-rule-container">
            <h3>Update Rule</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Item</label>
                    <select
                        className="form-control"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select an item</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Locations</label>
                    <select
                        className="form-control"
                        multiple
                        value={selectedLocations}
                        onChange={(e) => setSelectedLocations(Array.from(e.target.selectedOptions, option => option.value))}
                        required
                    >
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Rule</button>
            </form>
        </div>
    );
};

export default UpdateRule;
