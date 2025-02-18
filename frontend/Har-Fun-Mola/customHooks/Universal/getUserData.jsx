import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { userBaseUrl } from "../../app/URL/userBaseUrl";

const getUserData = () => {
  const user = useSelector((store) => store.auth.user);
  const userId = user?._id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(userId)
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${userBaseUrl}/get/${userId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        setUserData(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return { userData, loading, error };
};

export default getUserData;