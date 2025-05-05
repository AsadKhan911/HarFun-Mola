import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminBaseUrl } from '../../routes/base-url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Providers = () => {
    const [activeTab, setActiveTab] = useState('show');
    const [searchTerm, setSearchTerm] = useState('');
    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({ 
        fullName: '', 
        email: '', 
        phoneNumber: '', 
        password: '',
        city: ''
    });
    const [selectedProviderId, setSelectedProviderId] = useState('');
    const [editData, setEditData] = useState({ 
        fullName: '', 
        email: '', 
        phoneNumber: '',
        city: ''
    });

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        if (activeTab !== 'edit') {
            setSelectedProviderId('');
            setEditData({ fullName: '', email: '', phoneNumber: '', city: '' });
        }
    }, [activeTab]);

    const fetchProviders = async () => {
        try {
            const res = await axios.get(`${AdminBaseUrl}/providers`);
            setProviders(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch service providers.");
        }
    };

    const handleAddProvider = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${AdminBaseUrl}/providers`, formData);
            setFormData({ fullName: '', email: '', phoneNumber: '', password: '', city: '' });
            toast.success("Service provider added successfully!");
            fetchProviders();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add service provider.");
        }
    };

    const handleDeleteProvider = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service provider?")) return;
        try {
            await axios.delete(`${AdminBaseUrl}/providers/${id}`);
            toast.success("Service provider deleted successfully!");
            fetchProviders();
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete service provider.");
        }
    };

    const handleProviderSelect = (id) => {
        const provider = providers.find(p => p._id === id);
        setSelectedProviderId(id);
        if (provider) {
            setEditData({
                fullName: provider.fullName || '',
                email: provider.email || '',
                phoneNumber: provider.phoneNumber || '',
                city: provider.city || ''
            });
        }
    };

    const handleUpdateProvider = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${AdminBaseUrl}/providers/${selectedProviderId}`, editData);
            toast.success("Service provider updated successfully!");
            fetchProviders();
            setSelectedProviderId('');
            setEditData({ fullName: '', email: '', phoneNumber: '', city: '' });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update service provider.");
        }
    };

    const filteredProviders = providers.filter(
        (provider) =>
            provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'show':
                return (
                    <div className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full max-w-md p-3 pl-10 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                            <svg
                                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map((provider, index) => (
                                    <div 
                                        key={index} 
                                        className="relative bg-white shadow-lg p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                                    >
                                        <div className="flex items-start space-x-4 mb-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                                                    {provider.fullName.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-lg font-semibold text-gray-800 truncate">{provider.fullName}</h2>
                                                <p className="text-sm text-gray-500 truncate">{provider.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">
                                            <div style={{ fontFamily: 'Outfit-Bold' }} className="flex items-center text-lg text-gray-600">
                                                <span>{provider.role}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                <span>{provider.city}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                                <span>{provider.phoneNumber}</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleDeleteProvider(provider._id)}
                                            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Provider"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-700">No service providers found</h3>
                                    <p className="mt-1 text-gray-500">Try adjusting your search or add a new provider</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'add':
                return (
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">Add New Service Provider</h2>
                            </div>
                            <form onSubmit={handleAddProvider} className="p-6 space-y-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        id="fullName"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        id="phoneNumber"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="+1234567890"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        id="city"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="New York"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Add Service Provider
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );

            case 'edit':
                return (
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">Edit Service Provider</h2>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div>
                                    <label htmlFor="providerSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Provider</label>
                                    <select
                                        id="providerSelect"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                        value={selectedProviderId}
                                        onChange={(e) => handleProviderSelect(e.target.value)}
                                    >
                                        <option value="">Select a provider to edit</option>
                                        {providers.map((provider) => (
                                            <option key={provider._id} value={provider._id}>
                                                {provider.fullName} ({provider.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedProviderId && (
                                    <form onSubmit={handleUpdateProvider} className="space-y-6">
                                        <div>
                                            <label htmlFor="editFullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                id="editFullName"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="Name"
                                                value={editData.fullName}
                                                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                id="editEmail"
                                                type="email"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="Email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="editPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                id="editPhoneNumber"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="Phone Number"
                                                value={editData.phoneNumber}
                                                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="editCity" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <input
                                                id="editCity"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="City"
                                                value={editData.city}
                                                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                                            >
                                                Update Service Provider
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Service Providers Management</h1>
                    <p className="text-gray-500 mt-1">Manage all service providers in the system</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <div className="inline-flex rounded-lg shadow-sm">
                        {['show', 'add', 'edit'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-4 text-sm font-medium transition-all duration-200 ${activeTab === tab
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-purple-600 hover:bg-purple-50'
                                    } ${tab === 'show' ? 'rounded-l-lg' : ''} ${tab === 'edit' ? 'rounded-r-lg' : ''}`}
                            >
                                {tab === 'show' && 'Show Providers'}
                                {tab === 'add' && 'Add Provider'}
                                {tab === 'edit' && 'Edit Providers'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {renderContent()}
            
            <ToastContainer 
                position="bottom-right" 
                autoClose={3000} 
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName="shadow-lg"
            />
        </div>
    );
};

export default Providers;