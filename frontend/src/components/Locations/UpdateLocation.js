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
        <div className="form-container">
            <h3>Update Location</h3>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="location-name">Name</label>
                    <input
                        id="location-name"
                        type="text"
                        className="form-control"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    );
};

export default UpdateLocation;
