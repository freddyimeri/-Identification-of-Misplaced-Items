// src/components/Locations/DeleteLocation.js
import React from 'react';
import { deleteLocation } from '../../services/locationApi';

/**
 * Component to delete a location.
 * 
 * @param {string} locationId - The ID of the location to be deleted.
 * @param {Function} onDelete - Callback to be triggered after the location is deleted.
 */
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
