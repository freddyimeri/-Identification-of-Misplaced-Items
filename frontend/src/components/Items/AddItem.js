// src/components/Items/AddItem.js
import React, { useState } from 'react';
import { addItem } from '../../services/itemApi';
import './AddItem.css';

const AddItem = ({ onItemAdded }) => {
    const [itemName, setItemName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addItem({ name: itemName });
        setItemName('');
        onItemAdded(); // Trigger the callback
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
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddItem;
