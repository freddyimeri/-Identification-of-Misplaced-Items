import React, { useState } from 'react';
import AddLocation from '../../components/Locations/AddLocation';
import GetLocations from '../../components/Locations/GetLocations';
import UpdateLocation from '../../components/Locations/UpdateLocation';
import { deleteLocation } from '../../services/locationApi';
import './ManageLocationsPage.css';

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
        <div className="manage-locations-page">
            <h1>Manage Locations</h1>
            <AddLocation onLocationAdded={handleLocationAdded} />
            {editingLocation && (
                <UpdateLocation location={editingLocation} onUpdateCompleted={handleUpdateCompleted} />
            )}
            <GetLocations onEditLocation={handleEditLocation} onDeleteLocation={handleDeleteLocation} refresh={refreshLocations} />
        </div>
    );
};

export default ManageLocationsPage;
