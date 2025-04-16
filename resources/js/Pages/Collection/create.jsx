import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import Sidebar from '@/lib/SideNavLinks';
 // Assuming you have a constants file for predefined collections

export default function CreateCollection({ businesses, collections }) {

  // Define static parent collection options
  const PREDEFINED_PARENT_COLLECTIONS = [
    { id: '1', name: 'Shoes' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Accessories' },
    { id: '4', name: 'Electronics' },
    { id: '5', name: 'Furniture' }
  ];


  const [formData, setFormData] = useState({
    business_id: '',
    name: '',
    description: '',
    parent_id: '',
    active: true,
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox separately
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Debug what's being sent
    console.log('Submitting form data:', formData);
    
    
    // Use Inertia to submit the form
    Inertia.post('/dashboard/collection/store', formData, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Collection Added!',
          text: 'The collection was created successfully.',
          confirmButtonText: 'OK',
        });
        setProcessing(false);
      },
      onError: (errors) => {
        setErrors(errors);
        setProcessing(false);
        
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please check the form for errors.',
          confirmButtonText: 'OK',
        });
      }
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Create Collection" />
        <div className="p-6">
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Create New Collection</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Business Selection */}
              <div className="mb-4">
                <label htmlFor="business_id" className="block text-sm font-medium mb-1 text-gray-700">
                  Business
                </label>
                <select
                  id="business_id"
                  name="business_id"
                  value={formData.business_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select a business</option>
                  {businesses && businesses.map(business => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
                {errors.business_id && <p className="text-sm text-red-600 mt-1">{errors.business_id}</p>}
              </div>
              
              {/* Parent Collection Selection */}
              <div className="mb-4">
                <label htmlFor="parent_id" className="block text-sm font-medium mb-1 text-gray-700">
                  Parent Collection (optional)
                </label>
                <select
                  name="parent_id"
                  id="parent_id"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.parent_id || ''}
                >
                  <option value="">None (This is a parent collection)</option>
                  
                  {/* Only show Predefined Parent Collections */}
                  {PREDEFINED_PARENT_COLLECTIONS.map(collection => (
                    <option key={`predefined-${collection.id}`} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Collection Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  placeholder="Enter collection name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>
              
              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Enter description (optional)"
                ></textarea>
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
              
              {/* Active Status */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={processing}
                >
                  {processing ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}