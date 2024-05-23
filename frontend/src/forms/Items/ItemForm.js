// src/forms/Items/ItemForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InputField from '../../components/Common/Form/InputField';
import SubmitButton from '../../components/Common/Form/SubmitButton';

const ItemForm = ({ initialData = {}, onSubmit }) => {
    const [name, setName] = useState(initialData.name || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputField
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <SubmitButton label="Submit" />
        </form>
    );
};

ItemForm.propTypes = {
    initialData: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};

export default ItemForm;
