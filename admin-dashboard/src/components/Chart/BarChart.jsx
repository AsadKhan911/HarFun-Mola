import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { AdminBaseUrl } from '../../routes/base-url';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  // State to store dynamic data
  const [chartData, setChartData] = useState({
    labels: [],
    counts: [],
  });

  useEffect(() => {
    // Fetch data from the backend API using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get(`${AdminBaseUrl}/get-bookings-stats-byCategory`);
        const data = response.data;

        // Assuming the response contains 'labels' and 'counts'
        if (data && data.labels && data.counts) {
          setChartData({
            labels: data.labels,
            counts: data.counts,
          });
        }
      } catch (error) {
        console.error('Error fetching booking stats by category:', error.message);
      }
    };

    fetchData();
  }, []);
  
  const data = {
    labels: chartData.labels, // dynamic labels from state
    datasets: [
      {
        label: 'Bookings by Category',
        data: chartData.counts, // dynamic counts from state
        backgroundColor: '#7C3AED',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
