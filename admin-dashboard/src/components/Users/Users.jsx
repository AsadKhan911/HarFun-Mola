import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminBaseUrl } from '../../routes/base-url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
    const [activeTab, setActiveTab] = useState('show');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ fullName: '', email: '', role: 'Service User', phoneNumber: '', password: '' });
    const [selectedUserId, setSelectedUserId] = useState('');
    const [editData, setEditData] = useState({ fullName: '', email: '', role: 'Service User', phoneNumber: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (activeTab !== 'edit') {
            setSelectedUserId('');
            setEditData({ fullName: '', email: '', role: 'Service User', phoneNumber: '' });
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${AdminBaseUrl}/users`);
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch users.");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${AdminBaseUrl}/users`, formData);
            setFormData({ fullName: '', email: '', role: 'Service User', phoneNumber: '', password: '' });
            toast.success("User added successfully!");
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add user.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${AdminBaseUrl}/users/${id}`);
            toast.success("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete user.");
        }
    };

    const handleUserSelect = (id) => {
        const user = users.find(u => u._id === id);
        setSelectedUserId(id);
        if (user) {
            setEditData({
                fullName: user.fullName || '',
                email: user.email || '',
                role: user.role || 'Service User',
                phoneNumber: user.phoneNumber || ''
            });
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${AdminBaseUrl}/users/${selectedUserId}`, editData);
            toast.success("User updated successfully!");
            fetchUsers();
            setSelectedUserId('');
            setEditData({ fullName: '', email: '', role: 'Service User', phoneNumber: '' });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update user.");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'show':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md mb-6 p-3 border rounded-md shadow-sm"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <div key={index} className="relative bg-white shadow-md p-5 rounded-2xl border border-gray-100">
                                        <div className="mb-3">
                                            <h2 className="text-xl text-purple-700 font-semibold">{user.fullName}</h2>
                                            <p className="text-gray-600 text-sm">{user.email}</p>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <p><span className="text-purple-500">Role:</span> {user.role}</p>
                                            <p><span className="text-purple-500">Joined:</span> {new Date(user.createdAt).toDateString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                            title="Delete User"
                                        >
                                            &#10006;
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 col-span-full text-center">No users found.</p>
                            )}
                        </div>
                    </>
                );

            case 'add':
                return (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                        <form onSubmit={handleAddUser} className="bg-white shadow-md p-6 rounded-xl space-y-4 max-w-md">
                            <input className="w-full p-3 border rounded-md" placeholder="Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                            <input className="w-full p-3 border rounded-md" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <input className="w-full p-3 border rounded-md" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                            <input className="w-full p-3 border rounded-md" placeholder="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <select className="w-full p-3 border rounded-md" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                <option value="Service User">User</option>
                            </select>
                            <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">Add User</button>
                        </form>
                    </div>
                );

            case 'edit':
                return (
                    <div className="mt-6 max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                        <select
                            className="w-full p-3 mb-4 border rounded-md"
                            value={selectedUserId}
                            onChange={(e) => handleUserSelect(e.target.value)}
                        >
                            <option value="">Select a user to edit</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.fullName} ({user.email})
                                </option>
                            ))}
                        </select>

                        {selectedUserId && (
                            <form onSubmit={handleUpdateUser} className="bg-white shadow-md p-6 rounded-xl space-y-4">
                                <input className="w-full p-3 border rounded-md" placeholder="Name" value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} />
                                <input className="w-full p-3 border rounded-md" placeholder="Email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                                <input className="w-full p-3 border rounded-md" placeholder="Phone Number" value={editData.phoneNumber} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} />
                                <select className="w-full p-3 border rounded-md" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })}>
                                    <option value="Service User">User</option>
                                    <option value="Service Provider">Service Provider</option>
                                </select>
                                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">Update User</button>
                            </form>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl text-gray-800 mb-4">User Management</h1>
            <p className="text-sm text-gray-600 mb-4">
                Easily <span className="text-purple-600 font-medium">view</span>, <span className="text-purple-600 font-medium">add</span>, <span className="text-purple-600 font-medium">edit</span>, or <span className="text-purple-600 font-medium">delete</span> service users and providers to manage your platform efficiently.
            </p>

            <div className="flex gap-4 mb-4">
                {['show', 'add', 'edit'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 rounded-full text-sm font-medium transition ${activeTab === tab
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            }`}
                    >
                        {tab === 'show' && 'Show Users'}
                        {tab === 'add' && 'Add User'}
                        {tab === 'edit' && 'Edit Users'}
                    </button>
                ))}
            </div>
            {renderContent()}
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default Users;
