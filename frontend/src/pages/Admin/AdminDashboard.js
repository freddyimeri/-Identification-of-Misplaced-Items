//frontend/src/pages/Admin/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';


const AdminDashboard = () => {
    return (
        <div className="pages-container-center">
            <div className="row justify-content-center">
                <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                        <h1>Admin Dashboard</h1>
                        <div className="list-group">
                            <Link to="/admin/users" className="list-group-item list-group-item-action">Users Activity</Link>
                            <Link to="/admin/Manage-Locations" className="list-group-item list-group-item-action">Manage Locations</Link>
                            <Link to="/admin/manage-items" className="list-group-item list-group-item-action">Manage Items</Link>
                            <Link to="/admin/manage-rules" className="list-group-item list-group-item-action">Manage Rules</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
