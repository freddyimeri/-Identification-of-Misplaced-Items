// src/services/dailyLimitApi.js

import api from './api';

export const getDailyLimits = async () => {
    const response = await api.get('/api/process_misplaced_manager/daily-limits/');
    return response.data;
};

export const setDailyLimits = async (dailyImageLimit, dailyVideoLimit) => {
    const response = await api.post('/api/process_misplaced_manager/set-daily-limits/', {
        daily_image_limit: dailyImageLimit,
        daily_video_limit: dailyVideoLimit
    });
    return response.data;
};

export const checkDailyLimit = async (detectionType) => {
    const response = await api.get(`/api/process_misplaced_manager/check-daily-limit/?type=${detectionType}`);
    return response.data;
};

export const incrementDetection = async (detectionType) => {
    const response = await api.post('/api/process_misplaced_manager/increment-detection/', { type: detectionType });
    return response.data;
};
