// components/BookingsComplaints.jsx
import React from 'react';
import LineChart from '../Chart/LineChart';

const DS_COMP2 = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Bookings & Earnings */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 style={{ fontFamily: 'Outfit-Medium' }} className="text-2xl mb-4">Bookings & Earnings</h2>
        <LineChart />
      </div>

      {/* Complaints */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 style={{ fontFamily: 'Outfit-Medium' }} className="text-2xl mb-4">Complaints</h2>
        <ul className="space-y-5">
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Technician didn’t show up <span className="ml-auto text-lg text-gray-400">25 mins ago</span>
          </li>
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Extra charges added unexpectedly <span className="ml-auto text-lg text-gray-400">1 hour ago</span>
          </li>
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Poor behavior by technician <span className="ml-auto text-lg text-gray-400">2 hours ago</span>
          </li>
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Incomplete service delivery <span className="ml-auto text-lg text-gray-400">2 hours ago</span>
          </li>
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Unresponsive after booking <span className="ml-auto text-lg text-gray-400">2 hours ago</span>
          </li>
          <li style={{ fontFamily: 'Outfit' }} className="flex items-start gap-2 text-2xl text-black">
            <span className="text-red-500 text-2xl">!</span> Equipment was damaged <span className="ml-auto text-lg text-gray-400">2 hours ago</span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default DS_COMP2;
