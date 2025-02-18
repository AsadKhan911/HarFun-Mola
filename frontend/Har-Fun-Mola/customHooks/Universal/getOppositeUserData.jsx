import { useState, useEffect } from 'react';
import axios from 'axios';
import { userBaseUrl } from '../../app/URL/userBaseUrl.js';

const useFetchUserData = (userId) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${userBaseUrl}/get/${userId}`);
                setUserData(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    return { userData, loading, error };
};

export default useFetchUserData;
