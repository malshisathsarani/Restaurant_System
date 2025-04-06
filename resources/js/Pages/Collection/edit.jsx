import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import Sidebar from '@/lib/SideNavLinks';

export default function EditCollection({ collection, businesses }) {
  // Initialize form data with the collection values
  const [formData, setFormData] = useState({
    business_id: collection.business_id || '',
    name: collection.name || '',
    description: collection.description || '',
    active: collection.active || false,
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Log the received data for debugging
  useEffect(() => {
    console.log("Editing collection:", collection);
  }, [collection]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle checkbox separately
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Use Inertia to update the collection
    Inertia.put(route('dashboard.collection.update', collection.id), formData, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Collection Updated!',
          text: 'The collection was updated successfully.',
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
        <Head title={`Edit Collection: ${collection.name}`} />
        <div className="p-6">
          <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Edit Collection</h1>
            
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
                  {processing ? 'Updating...' : 'Update Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}