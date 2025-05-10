// components/AnalyticsActions.jsx
import React from 'react';
import BarChart from '../Chart/BarChart';
import { FaUserPlus, FaPlusCircle, FaCalendarPlus, FaThLarge } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DS_COMP3 = () => {
    const navigate = useNavigate()
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* Analytics */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 style={{ fontFamily: 'Outfit-Medium' }} className="text-2xl mb-4">Analytics</h2>
                <BarChart />
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
                <h2 style={{ fontFamily: 'Outfit-Medium' }} className="text-2xl mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <button className="flex items-center gap-2 px-4 py-16 bg-purple-100 text-purple-600 rounded-xl font-medium justify-center">
                        <FaUserPlus className="text-6xl" onClick={()=>navigate('/users')} />
                        Add User
                    </button>
                    <button className="flex items-center gap-2 px-4 py-16 bg-purple-100 text-purple-600 rounded-xl font-medium justify-center">
                        <FaPlusCircle className="text-6xl" onClick={()=>navigate('/providers')}/>
                        Add Providers
                    </button>
                    <button className="flex items-center gap-2 px-4 py-16 bg-purple-100 text-purple-600 rounded-xl font-medium justify-center">
                        <FaCalendarPlus className="text-6xl" onClick={()=>navigate('/bookings')}/>
                        Edit Booking
                    </button>
                    <button className="flex items-center gap-2 px-4 py-16 bg-purple-100 text-purple-600 rounded-xl font-medium justify-center">
                    <FaThLarge className="text-6xl" onClick={() => navigate('/categories')} />
                        Add Categories
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DS_COMP3;
