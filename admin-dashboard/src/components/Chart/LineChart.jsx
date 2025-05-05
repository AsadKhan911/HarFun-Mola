import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AdminBaseUrl } from '../../routes/base-url';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const [labels, setLabels] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${AdminBaseUrl}/get-monthly-booking-stats`); // Update if endpoint differs
        const data = response.data;

        const months = data.map(item => item.month);
        const bookings = data.map(item => item.totalBookings);
        const earnings = data.map(item => item.totalEarnings);

        setLabels(months);
        setBookingsData(bookings);
        setEarningsData(earnings);
      } catch (error) {
        console.error('Error fetching booking stats:', error);
      }
    };

    fetchStats();
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bookings',
        data: bookingsData,
        borderColor: '#7C3AED',
        backgroundColor: '#7C3AED33',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Earnings',
        data: earningsData,
        borderColor: '#A78BFA',
        backgroundColor: '#A78BFA33',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} height={200} width={400} />;
};

export default LineChart;
