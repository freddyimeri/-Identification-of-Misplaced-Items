import React, { useState } from 'react';
import { addLocation } from '../../services/locationApi';
import '../../styles/main.css';

const AddLocation = ({ onLocationAdded }) => {
    const [locationName, setLocationName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addLocation({ name: locationName });
        setLocationName('');
        onLocationAdded(); // Trigger the callback
    };

    return (
        <div className="add-location-container">
            <h3>Add Location</h3>
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
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default AddLocation;
