// src/forms/Auth/LoginForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FormContainer from '../../components/Common/Form/FormContainer';
import FormField from '../../components/Common/Form/FormField';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';
import SubmitButton from '../../components/Common/buttons/SubmitButton';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import '../../styles/main.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login/', { username, password });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('username', username);
            localStorage.setItem('isAuthenticated', true);
            navigate('/');
            window.location.reload(); // Refresh to update Navbar
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <h2 className="text-center">Login</h2>
            {error && <ErrorMessage message={error} />}
            <FormField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <PasswordInputField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <SubmitButton label="Login" />
        </FormContainer>
    );
};

export default LoginForm;
