// src/components/Locations/DeleteLocation.js
import React from 'react';
import { deleteLocation } from '../../services/locationApi';

const DeleteLocation = ({ locationId, onDelete }) => {
    const handleDelete = async () => {
        await deleteLocation(locationId);
        onDelete(); // Trigger the callback
    };

    return (
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
    );
};

export default DeleteLocation;
