import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminBaseUrl } from '../../routes/base-url';
import { useNavigate } from 'react-router-dom';

const AddRemoveCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '', predefinedServices: [] });
    const [service, setService] = useState({ serviceName: '', pricingOptions: [''] });
    const [activeTab, setActiveTab] = useState('view');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const navigate = useNavigate()

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${AdminBaseUrl}/categories`);
            setCategories(res.data.categories);
            console.log(res.data.categories)
           
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        try {
            await axios.post(`${AdminBaseUrl}/categories`, newCategory);
            toast.success('Category added successfully');
            setNewCategory({ name: '', icon: '', predefinedServices: [] });
            fetchCategories();
            setActiveTab('view');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        }
    };

    const handleAddService = async (id) => {
        try {
            await axios.put(`${AdminBaseUrl}/categories/${id}`, service);
            toast.success('Service added');
            fetchCategories();
            setService({ serviceName: '', pricingOptions: [''] });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add service');
        }
    };

    const handleRemoveCategory = async (id) => {
        try {
            await axios.delete(`${AdminBaseUrl}/categories/${id}`);
            toast.success('Category removed');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove category');
        }
    };

    const handleAddPricingOption = () => {
        setService({
            ...service,
            pricingOptions: [...service.pricingOptions, '']
        });
    };

    const handlePricingOptionChange = (index, value) => {
        const newOptions = [...service.pricingOptions];
        newOptions[index] = value;
        setService({ ...service, pricingOptions: newOptions });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
            <ToastContainer position="bottom-center" />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Major Categories</h1>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('view')}
                    className={`px-4 py-2 font-medium ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    View Categories
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    className={`px-4 py-2 font-medium ${activeTab === 'add' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Add Category
                </button>
                <button
                    onClick={() => setActiveTab('update')}
                    className={`px-4 py-2 font-medium ${activeTab === 'update' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Update Category
                </button>
                <button
                    onClick={() => setActiveTab('remove')}
                    className={`px-4 py-2 font-medium ${activeTab === 'remove' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Remove Category
                </button>
            </div>

            {/* View Categories Tab */}
            {activeTab === 'view' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(cat => (
                        <div
                            key={cat._id}
                            onClick={() => navigate('/category-details', { state: { category: cat } })}
                            className="cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-4 bg-gray-50 border-b flex items-center">
                                {cat.icon && (
                                    <img
                                        src={cat.icon}
                                        alt={cat.name}
                                        className="w-10 h-10 object-contain mr-3"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/png;base64,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';
                                        }}
                                    />
                                )}
                                <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {/* Add Category Tab */}
            {activeTab === 'add' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Category</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Plumbing, Electrical"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                            <input
                                type="text"
                                placeholder="https://example.com/icon.png"
                                value={newCategory.icon}
                                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {newCategory.icon && (
                                <div className="mt-2 flex items-center">
                                    <span className="text-sm text-gray-500 mr-2">Preview:</span>
                                    <img
                                        src={newCategory.icon}
                                        alt="Icon preview"
                                        className="w-8 h-8 object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/32';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleAddCategory}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            )}

            {/* Update Category Tab */}
            {activeTab === 'update' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Category</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-500">No categories available to update</p>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                                <select
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCategory && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Service</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Pipe Repair, Socket Installation"
                                                value={service.serviceName}
                                                onChange={(e) => setService({ ...service, serviceName: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Options</label>
                                            <div className="space-y-2">
                                                {service.pricingOptions.map((opt, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <input
                                                            type="text"
                                                            placeholder={`Option ${index + 1}`}
                                                            value={opt}
                                                            onChange={(e) => handlePricingOptionChange(index, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        {index > 0 && (
                                                            <button
                                                                onClick={() => {
                                                                    const newOptions = [...service.pricingOptions];
                                                                    newOptions.splice(index, 1);
                                                                    setService({ ...service, pricingOptions: newOptions });
                                                                }}
                                                                className="ml-2 text-red-500 hover:text-red-700"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={handleAddPricingOption}
                                                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                                >
                                                    <span className="mr-1">+</span> Add Another Option
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAddService(selectedCategory)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                                        >
                                            Add Service
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Remove Category Tab */}
            {activeTab === 'remove' && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Remove Category</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-500">No categories available to remove</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services Count</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map(cat => (
                                            <tr key={cat._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {cat.icon && (
                                                            <img
                                                                src={cat.icon}
                                                                alt={cat.name}
                                                                className="w-8 h-8 object-contain mr-3"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = 'https://via.placeholder.com/32';
                                                                }}
                                                            />
                                                        )}
                                                        <span className="font-medium">{cat.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {cat.predefinedServices.length}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleRemoveCategory(cat._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddRemoveCategories;