// src/components/Items/GetItems.js

import React, { useEffect, useState } from 'react';
import { getItems } from '../../services/itemApi';
import '../../styles/main.css';

/**
 * Component to fetch and display a list of items.
 * 
 * @param {Function} onEditItem - Callback to be triggered when an item is to be edited.
 * @param {Function} onDeleteItem - Callback to be triggered when an item is to be deleted.
 * @param {boolean} refresh - Flag to re-fetch items when changed.
 */
const GetItems = ({ onEditItem, onDeleteItem, refresh }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getItems();
            setItems(data);
            setLoading(false); // Set loading to false once data is fetched
        };

        fetchItems();
    }, [refresh]);

    if (loading) {
        return <div>Loading...</div>; // Display loading text while fetching data
    }

    return (
        <div className="card">
            <div className="card-body">
                <ul className="list-group">
                    {items.map(item => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {item.name}
                            <div>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditItem(item)}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger ml-2" onClick={() => onDeleteItem(item.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GetItems;
