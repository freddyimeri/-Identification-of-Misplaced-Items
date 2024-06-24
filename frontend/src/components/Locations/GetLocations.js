import React, { useEffect, useState } from 'react';
import { getLocations } from '../../services/locationApi';
import '../../styles/main.css';

const GetLocations = ({ onEditLocation, onDeleteLocation, refresh }) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const data = await getLocations();
            setLocations(data);
        };

        fetchLocations();
    }, [refresh]);

    return (
        <div className="locations-list">
            <h2>Locations List</h2>
            <ul className="list-group">
                {locations.map(location => (
                    <li key={location.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {location.name}
                        <div>
                            <button className="btn btn-primary btn-sm mr-2" onClick={() => onEditLocation(location)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => onDeleteLocation(location.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetLocations;
