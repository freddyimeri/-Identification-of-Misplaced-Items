// src/forms/UserProfile/ChangePasswordForm.js

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';
import FormContainer from '../../components/Common/Form/FormContainer';
import PasswordInputField from '../../components/Common/Password/PasswordInputField';
import ErrorMessage from '../../components/Common/Form/ErrorMessage';
import SubmitButton from '../../components/Common/buttons/SubmitButton';
import CancelButton from '../../components/Common/buttons/CancelButton';
import ActionButton from '../../components/Common/buttons/ActionButton';
import '../../styles/main.css';

const ChangePasswordForm = ({ onUpdatePassword }) => {
    const [showForm, setShowForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const validatePassword = useCallback(() => {
        const requirements = {
            length: /.{8,}/,
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            number: /[0-9]/,
        };

        const value = newPassword;
        let allValid = true;

        for (const key in requirements) {
            if (!requirements[key].test(value)) {
                allValid = false;
                break;
            }
        }

        return allValid;
    }, [newPassword]);

    const checkPasswordMatch = useCallback(() => {
        if (validatePassword()) {
            if (confirmPassword === '') {
                setPasswordMatchMessage('');
                return false;
            }
            if (newPassword === confirmPassword) {
                setPasswordMatchMessage('Passwords match');
                return true;
            } else {
                setPasswordMatchMessage('Passwords do not match');
                return false;
            }
        } else {
            setPasswordMatchMessage('');
            return false;
        }
    }, [newPassword, confirmPassword, validatePassword]);

    const validateForm = useCallback(() => {
        const isCurrentPasswordFilled = currentPassword.trim() !== '';
        const isNewPasswordValid = validatePassword();
        const isPasswordMatch = checkPasswordMatch();

        setIsFormValid(isCurrentPasswordFilled && isNewPasswordValid && isPasswordMatch);
    }, [currentPassword, validatePassword, checkPasswordMatch]);

    useEffect(() => {
        validateForm();
    }, [currentPassword, newPassword, confirmPassword, validateForm]);

    const handleActionClick = () => {
        setShowForm(!showForm);
    };

    const handleCancel = () => {
        setShowForm(false);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            await api.put('/api/user_dashboard/update_password/', {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setShowForm(false);
            onUpdatePassword();
        } catch (error) {
            setError('Password update failed');
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-card">
            <div className="card card-wide">
                <div className="card-body">
                    <h3 className="card-title">Update Password</h3>
                    <ActionButton className="action-button" label={showForm ? 'Cancel' : 'Change Password'} onClick={handleActionClick} />
                </div>
            </div>
            {showForm && (
                <div className="card card-wide">
                    <div className="card-body">
                        <FormContainer onSubmit={handleSubmit}>
                            {error && <ErrorMessage message={error} />}
                            <PasswordInputField
                                label="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <PasswordInputField
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                showRequirements={true}
                                required
                            />
                            <PasswordInputField
                                label="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <small id="passwordMatchMessage" className={`form-text ${passwordMatchMessage.includes('match') ? 'text-success' : 'text-danger'}`}>
                                {passwordMatchMessage}
                            </small>
                            <div className="form-buttons">
                                <SubmitButton className="submit-button" label={loading ? 'Updating...' : 'Update Password'} disabled={!isFormValid || loading} />
                                <CancelButton className="action-button" label="Cancel" onClick={handleCancel} />
                            </div>
                        </FormContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

ChangePasswordForm.propTypes = {
    onUpdatePassword: PropTypes.func.isRequired,
};

export default ChangePasswordForm;
