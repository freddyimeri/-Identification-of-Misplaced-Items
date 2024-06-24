// src/components/Items/UpdateItem.js
import React, { useState, useEffect } from 'react';
import { updateItem } from '../../services/itemApi';
import '../../styles/main.css';

const UpdateItem = ({ item, onUpdateCompleted }) => {
    const [itemName, setItemName] = useState(item.name);
    const [error, setError] = useState(null);

    useEffect(() => {
        setItemName(item.name);
    }, [item]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await updateItem(item.id, { name: itemName });
            onUpdateCompleted(); // Trigger the callback
        } catch (err) {
            setError('Error updating item: ' + err.message);
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
                {error && <p className="text-danger mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default UpdateItem;
