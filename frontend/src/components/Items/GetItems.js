// src/components/Items/GetItems.js
import React, { useEffect, useState } from 'react';
import { getItems } from '../../services/itemApi';
import '../../styles/main.css';

const GetItems = ({ onEditItem, onDeleteItem, refresh }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getItems();
            setItems(data);
        };

        fetchItems();
    }, [refresh]);

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
