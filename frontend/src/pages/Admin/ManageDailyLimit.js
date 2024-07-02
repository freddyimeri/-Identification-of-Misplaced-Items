// src/pages/Admin/ManageDailyLimit.js

import React, { useEffect, useState } from 'react';
import { getDailyLimits, setDailyLimits } from '../../services/dailyLimitApi';

const ManageDailyLimit = () => {
    const [dailyImageLimit, setDailyImageLimit] = useState(10);
    const [dailyVideoLimit, setDailyVideoLimit] = useState(5);

    useEffect(() => {
        const fetchDailyLimits = async () => {
            const data = await getDailyLimits();
            setDailyImageLimit(data.daily_image_limit);
            setDailyVideoLimit(data.daily_video_limit);
        };
        fetchDailyLimits();
    }, []);

    const handleImageLimitChange = (e) => {
        setDailyImageLimit(e.target.value);
    };

    const handleVideoLimitChange = (e) => {
        setDailyVideoLimit(e.target.value);
    };

    const handleSave = async () => {
        await setDailyLimits(dailyImageLimit, dailyVideoLimit);
        alert('Daily limits updated successfully');
    };

    return (
        <div className="pages-container-center">
            <h1>Manage Daily Detection Limits</h1>
            <div className="form-group">
                <label htmlFor="dailyImageLimit">Daily Image Limit:</label>
                <input
                    type="number"
                    id="dailyImageLimit"
                    value={dailyImageLimit}
                    onChange={handleImageLimitChange}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="dailyVideoLimit">Daily Video Limit:</label>
                <input
                    type="number"
                    id="dailyVideoLimit"
                    value={dailyVideoLimit}
                    onChange={handleVideoLimitChange}
                    className="form-control"
                />
            </div>
            <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
    );
};

export default ManageDailyLimit;
