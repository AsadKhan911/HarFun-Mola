import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaUserTie, FaCalendarCheck, FaDollarSign } from 'react-icons/fa';
import { AdminBaseUrl } from '../../routes/base-url';

const DS_COMP1 = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalServiceProviders: 0,
    activeBookings: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${AdminBaseUrl}/get-dashboard-stats`);
        console.log(response.data)
        setDashboardStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      icon: <FaUsers className="text-purple-600 text-2xl" />,
      label: 'Total Users',
      value: dashboardStats.totalUsers,
    },
    {
      icon: <FaUserTie className="text-purple-600 text-2xl" />,
      label: 'Service Providers',
      value: dashboardStats.totalServiceProviders,
    },
    {
      icon: <FaCalendarCheck className="text-purple-600 text-2xl" />,
      label: 'Active Bookings',
      value: dashboardStats.activeBookings,
    },
    {
      icon: <FaDollarSign className="text-purple-600 text-2xl" />,
      label: 'Total Earnings',
      value: `Pkr ${dashboardStats.totalEarnings.toLocaleString()}`,
    },
  ];

  return (
    <div className="p-6">
      <h1 style={{ fontFamily: 'Outfit-Medium' }} className="text-3xl text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white shadow-md p-4 rounded-xl w-[250px] h-[120px]"
          >
            <div className="bg-purple-100 p-3 rounded-full">
              {stat.icon}
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit' }} className="text-2xl">{stat.value}</h2>
              <p style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DS_COMP1;
