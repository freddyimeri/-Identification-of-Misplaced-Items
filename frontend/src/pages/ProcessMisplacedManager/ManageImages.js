// src/pages/ProcessMisplacedManager/ManageImages.js
import React, { useState, useEffect } from 'react';
import { getImages, createImage } from '../../services/processMisplacedManagerApi';

const ManageImages = () => {
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getImages();
            setImages(result);
        };
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        await createImage(formData);
        const result = await getImages();
        setImages(result);
    };

    return (
        <div>
            <h1>Manage Images</h1>
            <form onSubmit={handleImageUpload}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>
            <ul>
                {images.map((img) => (
                    <li key={img.id}>
                        <img src={img.image} alt="uploaded" />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageImages;
