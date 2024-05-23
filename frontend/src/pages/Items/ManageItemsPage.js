// src/pages/Items/ManageItemsPage.js
import React, { useState } from 'react';
import AddItem from '../../components/Items/AddItem';
import GetItems from '../../components/Items/GetItems';
import UpdateItem from '../../components/Items/UpdateItem';
import { deleteItem } from '../../services/itemApi';
import './ManageItemsPage.css';

const ManageItemsPage = () => {
    const [editingItem, setEditingItem] = useState(null);
    const [refreshItems, setRefreshItems] = useState(false);

    const handleItemAdded = () => {
        setRefreshItems(!refreshItems);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleUpdateCompleted = () => {
        setEditingItem(null);
        setRefreshItems(!refreshItems);
    };

    const handleDeleteItem = async (itemId) => {
        await deleteItem(itemId);
        setRefreshItems(!refreshItems);
    };

    return (
        <div className="manage-items-container container mt-5">
            <h1 className="text-center mb-4">Manage Items</h1>
            <h2 className="text-center mb-4">Add Item</h2>
            <AddItem onItemAdded={handleItemAdded} />
            {editingItem && (
                <>
                    <h2 className="text-center mb-4">Edit Item</h2>
                    <UpdateItem item={editingItem} onUpdateCompleted={handleUpdateCompleted} />
                </>
            )}
            <h2 className="text-center mb-4">Items List</h2>
            <GetItems onEditItem={handleEditItem} onDeleteItem={handleDeleteItem} refresh={refreshItems} />
        </div>
    );
};

export default ManageItemsPage;
