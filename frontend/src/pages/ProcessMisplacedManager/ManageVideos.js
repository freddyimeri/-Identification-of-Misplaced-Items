// src/pages/ProcessMisplacedManager/ManageVideos.js
import React, { useState, useEffect } from 'react';
import { getVideos, createVideo } from '../../services/processMisplacedManagerApi';

const ManageVideos = () => {
    const [videos, setVideos] = useState([]);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getVideos();
            setVideos(result);
        };
        fetchData();
    }, []);

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleVideoUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('video', video);
        await createVideo(formData);
        const result = await getVideos();
        setVideos(result);
    };

    return (
        <div>
            <h1>Manage Videos</h1>
            <form onSubmit={handleVideoUpload}>
                <input type="file" onChange={handleVideoChange} />
                <button type="submit">Upload</button>
            </form>
            <ul>
                {videos.map((vid) => (
                    <li key={vid.id}>
                        <video width="320" height="240" controls>
                            <source src={vid.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageVideos;
