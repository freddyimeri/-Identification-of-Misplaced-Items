// src/forms/Items/ItemForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormContainer from '../../components/Common/Form/FormContainer';
import FormField from '../../components/Common/Form/FormField';
import SubmitButton from '../../components/Common/Form/SubmitButton';
import '../../styles/main.css';

const ItemForm = ({ initialData = {}, onSubmit }) => {
    const [name, setName] = useState(initialData.name || '');

    const handleSubmit = () => {
        onSubmit({ name });
    };

    return (
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
    );
};

ItemForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};

export default ItemForm;
