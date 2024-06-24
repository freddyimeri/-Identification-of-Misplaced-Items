// src/pages/Locations/ManageLocationsPage.js
import React, { useState } from 'react';
import AddLocation from '../../components/Locations/AddLocation';
import GetLocations from '../../components/Locations/GetLocations';
import UpdateLocation from '../../components/Locations/UpdateLocation';
import { deleteLocation } from '../../services/locationApi';
import '../../styles/main.css'; // Ensure this is the correct path to main.css

const ManageLocationsPage = () => {
    const [editingLocation, setEditingLocation] = useState(null);
    const [refreshLocations, setRefreshLocations] = useState(false);

    const handleLocationAdded = () => {
        setRefreshLocations(!refreshLocations);
    };

    const handleEditLocation = (location) => {
        setEditingLocation(location);
    };

    const handleUpdateCompleted = () => {
        setEditingLocation(null);
        setRefreshLocations(!refreshLocations);
    };

    const handleDeleteLocation = async (locationId) => {
        await deleteLocation(locationId);
        setRefreshLocations(!refreshLocations);
    };

    return (
        <div className="pages-container-center">
            <h1 className="text-center mb-4">Manage Locations</h1>
            <AddLocation onLocationAdded={handleLocationAdded} />
            {editingLocation && (
                <>
                    <h2 className="text-center mb-4">Edit Location</h2>
                    <UpdateLocation location={editingLocation} onUpdateCompleted={handleUpdateCompleted} />
                </>
            )}
            <h2 className="text-center mb-4">Locations List</h2>
            <GetLocations onEditLocation={handleEditLocation} onDeleteLocation={handleDeleteLocation} refresh={refreshLocations} />
        </div>
    );
};

export default ManageLocationsPage;
