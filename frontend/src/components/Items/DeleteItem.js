// src/components/Items/DeleteItem.js
import React from 'react';
import { deleteItem } from '../../services/itemApi';

const DeleteItem = ({ itemId, onDelete }) => {
    const handleDelete = async () => {
        await deleteItem(itemId);
        onDelete(); // Trigger the callback
    };

    return (
        <button className="btn btn-sm btn-outline-danger ml-2" onClick={handleDelete}>Delete</button>
    );
};

export default DeleteItem;
