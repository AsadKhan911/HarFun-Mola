import { useEffect, useState } from 'react';
import axios from 'axios';
import { AdminBaseUrl } from '../../routes/base-url';

const Bookings = () => {
    const [tab, setTab] = useState('view');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState('');
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (statusFilter) {
                queryParams.append('status', statusFilter);
            }

            const res = await axios.get(`${AdminBaseUrl}/bookings?${queryParams.toString()}`);
            setBookings(res.data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredBookings = bookings.filter(booking => {
        return (
            (booking.user?.fullName?.toLowerCase().includes(searchTerm)) ||
            (booking.service?.serviceName?.toLowerCase().includes(searchTerm)) ||
            (new Date(booking.date).toLocaleDateString().includes(searchTerm)) ||
            (booking.service?.city?.toLowerCase().includes(searchTerm)) ||
            (booking.status?.toLowerCase().includes(searchTerm))
        );
    });

    const handleView = (booking) => {
        setSelectedBooking(booking);
        setEditData(booking);
        setTab('edit');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${AdminBaseUrl}/bookings/${id}`);
            fetchBookings();
            setSelectedBooking(null);
            setTab('view');
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedBooking) return;
        try {
            await axios.put(`${AdminBaseUrl}/bookings/${selectedBooking._id}/status`, { status: statusUpdate });
            fetchBookings();
            setTab('view');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleEdit = async () => {
        try {
            await axios.put(`${AdminBaseUrl}/bookings/${editData._id}`, editData);
            fetchBookings();
            setTab('view');
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const applyStatusFilter = () => {
        fetchBookings();
    };

    const resetFilters = () => {
        setStatusFilter('');
        setSearchTerm('');
        fetchBookings();
    };

    const handleQuickStatusUpdate = (booking) => {
        setSelectedBooking(booking);
        setStatusUpdate(booking.status);
        setTab('status');
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {loading ? 'Loading...' : `${bookings.length} Bookings`}
                        </span>
                    </div>
                </div>

                {/* Tab Menu */}
                <div className="flex space-x-2 mb-8 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
                    <button
                        onClick={() => setTab('view')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            tab === 'view' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        View Bookings
                    </button>
                    <button
                        onClick={() => setTab('edit')}
                        disabled={!selectedBooking}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            tab === 'edit' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        } ${!selectedBooking && 'opacity-50 cursor-not-allowed'}`}
                    >
                        Edit Booking
                    </button>
                    <button
                        onClick={() => setTab('status')}
                        disabled={!selectedBooking}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                            tab === 'status' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        } ${!selectedBooking && 'opacity-50 cursor-not-allowed'}`}
                    >
                        Update Status
                    </button>
                </div>

                {/* View Bookings */}
                {tab === 'view' && (
                    <div className="space-y-6">
                        {/* Search and Filter Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Bookings</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by user, service, date, city or status"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                                    <div className="flex space-x-2">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="flex-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="In-Progress">In-Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <button
                                            onClick={applyStatusFilter}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            disabled={loading}
                                        >
                                            Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bookings List */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                                <div className="mt-6">
                                    <button 
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredBookings.map((booking) => (
                                    <div key={booking._id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">User</dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-lg font-semibold text-gray-900">
                                                                {booking.user?.fullName}
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Service</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{booking.service?.serviceName}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">
                                                        {new Date(booking.date).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">City</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{booking.service?.city}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                    <dd className="mt-1">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                            booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            booking.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </dd>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex space-x-3">
                                                <button
                                                    onClick={() => handleView(booking)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleQuickStatusUpdate(booking)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Status
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(booking._id)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Edit Booking */}
                {tab === 'edit' && selectedBooking && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Edit Booking #{selectedBooking._id.slice(-6)}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Update booking details
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="address"
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Address"
                                            value={editData.address || ''}
                                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
                                        Time Slot
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="timeSlot"
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Time Slot"
                                            value={editData.timeSlot || ''}
                                            onChange={(e) => setEditData({ ...editData, timeSlot: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                                        Instructions
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="instructions"
                                            rows={3}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Special instructions"
                                            value={editData.instructions || ''}
                                            onChange={(e) => setEditData({ ...editData, instructions: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setTab('view')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Update Status */}
                {tab === 'status' && selectedBooking && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Update Status for Booking #{selectedBooking._id.slice(-6)}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Change the current booking status
                            </p>
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Current Status
                                    </label>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                            selectedBooking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            selectedBooking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            selectedBooking.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedBooking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        New Status
                                    </label>
                                    <select
                                        id="status"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                        value={statusUpdate}
                                        onChange={(e) => setStatusUpdate(e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="In-Progress">In-Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setTab('view')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        disabled={!statusUpdate}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                            !statusUpdate ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        Update Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;