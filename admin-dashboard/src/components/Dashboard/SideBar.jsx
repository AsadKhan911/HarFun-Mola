import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ children }) => {
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-purple-700 text-white h-screen sticky top-0 shadow-xl">
                {/* Logo/Sidebar Header */}
                <div style={{ fontFamily: 'Outfit-Medium' }} className="mt-4 p-5 text-center text-3xl rounded-lg py-3 px-4 shadow-inner text-white">
                    Harfun-Mola
                </div>

                {/* Navigation Links */}
                <ul className="mt-4 space-y-2 px-4">
                    <li>
                        <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/users"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Users</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/providers"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Service Providers</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/categories"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/listings"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Listings</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/bookings"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/payments"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Payments</span>
                        </Link>
                    </li>
                    
                
                    {/* <li>
                        <Link
                            to="/analytics"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Analytics</span>
                        </Link>
                    </li> */}

                    {/* <li>
                        <Link
                            to="/feedbacks"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Complaints & Feedbacks</span>
                        </Link>
                    </li> */}

                    <li>
                        <Link
                            to="/settings"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group"
                        >
                            <div className="p-2 rounded-md bg-purple-500 group-hover:bg-purple-400 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-xl">Settings</span>
                        </Link>
                    </li>

                    {/* Logout with different styling */}
                    <li className="mt-8 border-t border-purple-600/50 pt-4">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-600/80 transition-all duration-200 group text-purple-100"
                        >
                            <div className="p-2 rounded-md bg-purple-600/70 group-hover:bg-purple-500 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <span style={{ fontFamily: 'Outfit-Medium' }} className="text-2xl">Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Main content area where children will be rendered */}
            <div className="flex-1 p-10 bg-gray-50">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;