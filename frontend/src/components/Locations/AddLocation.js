// src/components/Locations/AddLocation.js
import React, { useState } from 'react';
import { addLocation } from '../../services/locationApi';
import '../../styles/main.css';

/**
 * Component to add a new location.
 * 
 * @param {Function} onLocationAdded - Callback to be triggered after a location is added.
 */
const AddLocation = ({ onLocationAdded }) => {
    const [locationName, setLocationName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addLocation({ name: locationName });
        setLocationName('');
        onLocationAdded(); // Trigger the callback
    };

    return (
        <div className="form-container">
            <h3>Add Location</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="location-name">Name</label>
                    <input
                        type="text"
                        id="location-name"
                        className="form-control"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default AddLocation;
