// src/forms/Items/ItemForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormContainer from '../../components/Common/Form/FormContainer';
import FormField from '../../components/Common/Form/FormField';
import SubmitButton from '../../components/Common/buttons/SubmitButton';
import '../../styles/main.css';

const ItemForm = ({ initialData = {}, onSubmit }) => {
    const [name, setName] = useState(initialData.name || '');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        onSubmit({ name });
    };

    return (
        <div className="form-container">
            <FormContainer onSubmit={handleSubmit}>
                <FormField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <SubmitButton label="Submit" />
            </FormContainer>
        </div>
    );
};

ItemForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};

export default ItemForm;
