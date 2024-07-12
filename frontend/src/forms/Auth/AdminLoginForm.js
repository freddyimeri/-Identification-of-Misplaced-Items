// src/forms/Auth/AdminLoginForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/auth';  // Import the adminLogin function
import FormContainer from '../../components/Common/Form/FormContainer';
import FormField from '../../components/Common/Form/FormField';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';
import SubmitButton from '../../components/Common/buttons/SubmitButton';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import '../../styles/main.css';

const AdminLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminLogin({ username, password });
            navigate('/admin/dashboard');
            window.location.reload(); // Refresh to update Navbar
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <h2 className="text-center">Admin Login</h2>
            {error && <ErrorMessage message={error} />}
            <FormField
                label="Username"
                type="text"
                id="username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <PasswordInputField
                label="Password"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton label="Login" />
        </FormContainer>
    );
};

export default AdminLoginForm;
