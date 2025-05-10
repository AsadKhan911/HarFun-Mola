import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminBaseUrl } from '../../routes/base-url';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2, FiUserPlus, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
    const [admins, setAdmins] = useState([]);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation (min 8 chars, at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Fetch all admins
    const fetchAdmins = async () => {
        try {
            const res = await axios.get(`${AdminBaseUrl}/list`);
            setAdmins(res.data);
        } catch (err) {
            console.error('Failed to load admins', err);
            toast.error('Failed to load admin list');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Filter admins based on search term
    const filteredAdmins = admins.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Validate form fields
    const validateForm = () => {
        let valid = true;
        const newErrors = { email: '', password: '' };

        // Email validation
        // Enhanced Email validation
        if (!form.email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
            valid = false;
        } else if (emailExists(form.email)) {
            newErrors.email = 'This email is already registered';
            valid = false;
        }

        // Password validation (only required when creating new admin)
        if (!editId) {
            if (!form.password) {
                newErrors.password = 'Password is required';
                valid = false;
            } else if (!passwordRegex.test(form.password)) {
                newErrors.password = 'Password must be at least 8 characters with at least one letter and one number';
                valid = false;
            }
        } else if (form.password && !passwordRegex.test(form.password)) {
            // Validate password if provided during edit (optional field)
            newErrors.password = 'Password must be at least 8 characters with at least one letter and one number';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Check if email already exists
    const emailExists = (email) => {
        return admins.some(admin =>
            admin.email.toLowerCase() === email.toLowerCase() &&
            admin._id !== editId
        );
    };

    // Add or Update Admin
    // Add or Update Admin
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) return;

        // Client-side duplicate check
        if (emailExists(form.email)) {
            toast.error('An admin with this email already exists');
            setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
            return;
        }

        setLoading(true);
        try {
            if (editId) {
                await axios.put(`${AdminBaseUrl}/edit/${editId}`, form);
                toast.success('Admin updated successfully');
            } else {
                await axios.post(`${AdminBaseUrl}/add`, form);
                toast.success('Admin added successfully');
            }
            resetForm();
            fetchAdmins();
        } catch (err) {
            if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
                toast.error('An admin with this email already exists');
                setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
            } else {
                toast.error(err.response?.data?.message || 'Something went wrong');
            }
        }
        setLoading(false);
    };

    // Delete Admin
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        try {
            await axios.delete(`${AdminBaseUrl}/delete/${id}`);
            toast.success('Admin deleted successfully');
            fetchAdmins();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    // Load admin data for editing
    const handleEdit = (admin) => {
        setForm({ email: admin.email, password: '' });
        setEditId(admin._id);
        setIsFormOpen(true);
        setErrors({ email: '', password: '' });
    };

    // Reset form
    const resetForm = () => {
        setForm({ email: '', password: '' });
        setEditId(null);
        setIsFormOpen(false);
        setErrors({ email: '', password: '' });
    };

    // Handle input changes with validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
      
        // Real-time email validation
        if (name === 'email' && value && !emailRegex.test(value)) {
          setErrors(prev => ({ 
            ...prev, 
            email: 'Please enter a valid email address (e.g., user@example.com)' 
          }));
        } else if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }));
        }
      };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FiUserPlus /> Add New Admin
                    </button>
                )}
            </div>

            {/* Search and filter */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search admins by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                            <FiX />
                        </button>
                    )}
                </div>
            </div>

            {/* Add/Edit Form */}
            {isFormOpen && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {editId ? 'Edit Admin' : 'Add New Admin'}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={form.email}
                                onChange={handleInputChange}
                                onBlur={() => {
                                    if (form.email && !emailRegex.test(form.email)) {
                                        setErrors(prev => ({
                                            ...prev,
                                            email: 'Please enter a valid email address (e.g., user@example.com)'
                                        }));
                                    }
                                }}
                                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <FiAlertCircle className="mr-1" /> {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password {editId && '(Leave blank to keep current)'}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder={editId ? 'Leave blank to keep current' : 'Enter password'}
                                value={form.password}
                                onChange={handleInputChange}
                                onBlur={() => {
                                    if (!editId && !form.password) {
                                        setErrors(prev => ({ ...prev, password: 'Password is required' }));
                                    } else if (form.password && !passwordRegex.test(form.password)) {
                                        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters with at least one letter and one number' }));
                                    }
                                }}
                                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : ' border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <FiAlertCircle className="mr-1" /> {errors.password}
                                </p>
                            )}
                            {!editId && !errors.password && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Password must be at least 8 characters with at least one letter and one number
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
                            >
                                {loading ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        {editId ? <FiSave /> : <FiUserPlus />}
                                        {editId ? 'Update Admin' : 'Add Admin'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admin List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Admin List</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {filteredAdmins.length} of {admins.length} admins
                    </p>
                </div>
                {filteredAdmins.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchTerm ? 'No matching admins found' : 'No admins available'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(admin.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(admin)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;