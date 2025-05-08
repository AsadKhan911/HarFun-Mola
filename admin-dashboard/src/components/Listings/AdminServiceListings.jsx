import React, { useState, useEffect } from 'react';
import { AdminBaseUrl } from '../../routes/base-url';
import axios from 'axios';

const ServiceListingsManagement = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalListings, setTotalListings] = useState(0);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    availability: ''
  });

  // For edit form
  const [editForm, setEditForm] = useState({
    id: '',
    serviceName: '',
    description: '',
    pricingOptions: [{ label: 'Standard', price: '' }],
    city: '',
    availability: true
  });

  // For delete operation
  const [deleteId, setDeleteId] = useState('');
  const [banId, setBanId] = useState('');

  const limit = 10;

  // Fetch listings with filters
  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.availability !== '') queryParams.append('availability', filters.availability);
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      const response = await fetch(`${AdminBaseUrl}/listings?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setListings(data.listings);
        setTotalListings(data.total);
      } else {
        throw new Error(data.message || 'Failed to fetch listings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (index, field, value) => {
    const updatedPricingOptions = [...editForm.pricingOptions];
    updatedPricingOptions[index][field] = field === 'price' ? Number(value) : value;
    setEditForm({ ...editForm, pricingOptions: updatedPricingOptions });
  };

  const addPricingOption = () => {
    setEditForm({
      ...editForm,
      pricingOptions: [...editForm.pricingOptions, { label: '', price: '' }]
    });
  };

  const removePricingOption = (index) => {
    const updatedPricingOptions = [...editForm.pricingOptions];
    updatedPricingOptions.splice(index, 1);
    setEditForm({
      ...editForm,
      pricingOptions: updatedPricingOptions
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${AdminBaseUrl}/categories`);
      setCategories(response.data.categories);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to fetch categories';
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchListings();
      fetchCategories();
    }
  }, [activeTab, page, filters]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const hasUpdates = Object.entries(editForm).some(
        ([key, value]) => key !== 'id' && value !== ''
      );

      if (!hasUpdates) {
        throw new Error('No changes detected');
      }

      await axios.put(
        `${AdminBaseUrl}/listings/${editForm.id}`,
        editForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Listing updated successfully!');
      setEditForm({
        id: '',
        title: '',
        description: '',
        price: '',
        city: '',
        availability: true
      });
      setActiveTab('view');
      fetchListings();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await axios.delete(`${AdminBaseUrl}/listings/${deleteId}`);
      alert('Listing deleted successfully!');
      setDeleteId('');
      setActiveTab('view');
      fetchListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    if (!banId) return;

    setLoading(true);
    try {
      await axios.put(`${AdminBaseUrl}/ban-listing/${banId}`);
      alert('Listing banned successfully!');
      setBanId('');
      setActiveTab('view');
      fetchListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to ban listing');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSelection = (listing) => {
    setEditForm({
      id: listing._id,
      serviceName: listing.serviceName,
      description: listing.description,
      pricingOptions: listing.pricingOptions?.length > 0
        ? listing.pricingOptions
        : [{ label: 'Standard', price: '' }],
      city: listing.city,
      availability: listing.availability
    });
    setActiveTab('edit');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Service Listings Management</h1>
          
          {/* Tabs */}
          <div className="flex mt-6 border-b border-gray-200">
            {['view', 'edit', 'delete', 'ban'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm ${activeTab === tab 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Listings
              </button>
            ))}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'view' && (
            <div>
              {/* Filters */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                      id="city"
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Cities</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      value={filters.availability}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">All</option>
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Listings */}
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Service Listings ({totalListings} total)</h2>
                {listings.length === 0 ? (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-gray-500">No listings found</p>
                  </div>
                ) : (
                  <>
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {listings.map(listing => (
                            <tr key={listing._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{listing.serviceName}</td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{listing.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.city}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {listing.availability ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {listing.pricingOptions?.length > 0 ? (
                                  <ul className="space-y-1">
                                    {listing.pricingOptions.map((option, idx) => (
                                      <li key={idx} className="flex justify-between">
                                        <span className="font-medium">{option.label}:</span>
                                        <span>${option.price.toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-gray-400 italic">No pricing</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => handleEditSelection(listing)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 px-2">
                      <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page <span className="font-medium">{page}</span> of <span className="font-medium">{Math.ceil(totalListings / limit)}</span>
                      </span>
                      <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= Math.ceil(totalListings / limit)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page >= Math.ceil(totalListings / limit) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Service Listing</h2>
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label htmlFor="edit-id" className="block text-sm font-medium text-gray-700">Listing ID</label>
                  <input
                    type="text"
                    id="edit-id"
                    name="id"
                    value={editForm.id}
                    onChange={handleEditChange}
                    readOnly
                    className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-serviceName" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id="edit-serviceName"
                    name="serviceName"
                    value={editForm.serviceName}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pricing Options</label>
                  <div className="mt-1 space-y-2">
                    {editForm.pricingOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Label"
                          value={option.label}
                          onChange={(e) => handlePricingChange(index, 'label', e.target.value)}
                          className="block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={option.price}
                          onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                          min="0"
                          step="0.01"
                          className="block w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {editForm.pricingOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePricingOption(index)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPricingOption}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Pricing Option
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="edit-city"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-availability"
                    name="availability"
                    checked={editForm.availability}
                    onChange={handleEditChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-availability" className="ml-2 block text-sm text-gray-700">
                    Available
                  </label>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update Listing
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Delete Service Listing</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="delete-id" className="block text-sm font-medium text-gray-700">Listing ID to Delete</label>
                  <input
                    type="text"
                    id="delete-id"
                    name="deleteId"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                    placeholder="Enter listing ID"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleDelete}
                    disabled={!deleteId}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${!deleteId ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                  >
                    Confirm Delete
                  </button>
                </div>
                <p className="text-sm text-red-600 font-medium">Warning: This action cannot be undone!</p>
              </div>
            </div>
          )}

          {activeTab === 'ban' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Ban Service Listing</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ban-id" className="block text-sm font-medium text-gray-700">Listing ID to Ban</label>
                  <input
                    type="text"
                    id="ban-id"
                    name="banId"
                    value={banId}
                    onChange={(e) => setBanId(e.target.value)}
                    placeholder="Enter listing ID"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleBan}
                    disabled={!banId}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${!banId ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                  >
                    Confirm Ban
                  </button>
                </div>
                <p className="text-sm text-gray-500">This will set the listing's availability to false.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceListingsManagement;