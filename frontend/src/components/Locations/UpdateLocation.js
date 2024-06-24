// src/components/Locations/UpdateLocation.js
import React, { useState, useEffect } from 'react';
import { updateLocation } from '../../services/locationApi';
import '../../styles/main.css';

const UpdateLocation = ({ location, onUpdateCompleted }) => {
    const [locationName, setLocationName] = useState(location.name);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLocationName(location.name);
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updateLocation(location.id, { name: locationName });
            onUpdateCompleted(); // Trigger the callback
        } catch (err) {
            setError('Error updating location: ' + err.message);
        }
    };

    return (
        <div className="update-location-container">
            <h3>Update Location</h3>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UpdateLocation;
