//src/pages/Admin/AdminUsers.js

import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import '../../styles/main.css'; // Ensure this is the correct path to main.css

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.get('api/admin-app/users/');
            setUsers(response.data);
        };
        fetchUsers();
    }, []);

    const handleDeactivate = async (userId) => {
        const confirmDeactivate = window.confirm('Are you sure you want to deactivate this user?');
        if (confirmDeactivate) {
            await api.post(`/api/admin-app/users/deactivate/${userId}/`);
            setUsers(users.map(user => user.id === userId ? { ...user, is_active: false } : user));
        }
    };

    const handleActivate = async (userId) => {
        await api.post(`/api/admin-app/users/activate/${userId}/`);
        setUsers(users.map(user => user.id === userId ? { ...user, is_active: true } : user));
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            await api.delete(`/api/admin-app/users/delete/${userId}/`);
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    return (
        <div className="pages-container-center">
            <h1>Users Activity</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date Joined</th>
                        <th>Last Login</th>
                        <th>Is Active</th>
                        <th>Is Staff</th>
                        <th>Is Superuser</th>
                        <th>Groups</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.date_joined}</td>
                            <td>{user.last_login}</td>
                            <td>{user.is_active ? 'Yes' : 'No'}</td>
                            <td>{user.is_staff ? 'Yes' : 'No'}</td>
                            <td>{user.is_superuser ? 'Yes' : 'No'}</td>
                            <td>{user.groups.map(group => group.name).join(', ')}</td>
                            <td>
                                {user.is_active ? (
                                    <button onClick={() => handleDeactivate(user.id)} className="btn btn-warning btn-sm">Deactivate</button>
                                ) : (
                                    <button onClick={() => handleActivate(user.id)} className="btn btn-success btn-sm">Activate</button>
                                )}
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
