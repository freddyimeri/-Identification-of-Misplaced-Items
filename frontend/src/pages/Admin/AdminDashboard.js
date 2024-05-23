//frontend/src/pages/Admin/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';  // Import the CSS file

const AdminDashboard = () => {
    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <div className="list-group">
                <Link to="/admin/users" className="list-group-item list-group-item-action">Users Activity</Link>
                <Link to="/admin/Manage-Locations" className="list-group-item list-group-item-action">Manage Locations</Link>
                <Link to="/admin/manage-items" className="list-group-item list-group-item-action">Manage Items</Link>
                <Link to="/admin/manage-rules" className="list-group-item list-group-item-action">Manage Rules</Link>

            </div>
        </div>
    );
};

export default AdminDashboard;
