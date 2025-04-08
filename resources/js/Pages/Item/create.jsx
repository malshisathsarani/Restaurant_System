import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '@/lib/SideNavLinks';

export default function CreateItem({ businesses, csrf }) {
  const [formData, setFormData] = useState({
    business_id: '',
    collection_id: '',
    title: '',
    introduction: '',
    description: '',
    active: true,
    image: null,
  });

  const [availableCollections, setAvailableCollections] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch collections when business is selected
  useEffect(() => {
    if (formData.business_id) {
      fetch(`/api/collections/${formData.business_id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched collections:", data);
          setAvailableCollections(data);

          // Optional: auto-select first collection
          setFormData(prev => ({
            ...prev,
            collection_id: data.length > 0 ? data[0].id : '',
          }));
        })
        .catch(err => {
          console.error("Error fetching collections:", err);
          setAvailableCollections([]);
          setFormData(prev => ({ ...prev, collection_id: '' }));
        });
    } else {
      setAvailableCollections([]);
      setFormData(prev => ({ ...prev, collection_id: '' }));
    }
  }, [formData.business_id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      const val = type === 'checkbox' ? checked : value;
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
  
    // Create form data object for submission
    const submitData = new FormData();
  
    // Add form fields to FormData, with special handling for the boolean field "active"
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if(key === 'active'){
          // Convert boolean to string '1' for true or '0' for false
          submitData.append(key, value ? '1' : '0');
        } else {
          submitData.append(key, value);
        }
      }
    });
  
    console.log("Submitting data to /dashboard/item/store");
    console.log("Form data:", formData);
  
    axios.post('/dashboard/item/store', submitData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-TOKEN': csrf,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      console.log("Item created successfully:", response.data);
      // Show success message
      Swal.fire({
        title: 'Success!',
        text: 'Item created successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to items list
        Inertia.visit('/dashboard/item');
      });
    })
    .catch(error => {
      console.error("Validation errors:", error.response.data.errors);
      setErrors(error.response.data.errors || {});
      setProcessing(false);
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Head title="Create Item" />
        <div className="p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Create New Item</h1>

            <form onSubmit={handleSubmit}>
              {/* Business */}
              <div className="mb-4">
                <label htmlFor="business_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Business *
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
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.business_id && <p className="text-sm text-red-600 mt-1">{errors.business_id}</p>}
              </div>

              {/* Collection */}
              <div className="mb-4">
                <label htmlFor="collection_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Collection *
                </label>
                <select
                  id="collection_id"
                  name="collection_id"
                  value={formData.collection_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  disabled={!formData.business_id}
                >
                  <option value="">Select a collection</option>
                  {availableCollections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {!formData.business_id && (
                  <p className="text-sm text-gray-500 mt-1">Select a business first</p>
                )}

                {formData.business_id && availableCollections.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No collections available for this business.</p>
                )}

                {errors.collection_id && <p className="text-sm text-red-600 mt-1">{errors.collection_id}</p>}
              </div>

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                  placeholder="Enter item title"
                />
                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
              </div>

              {/* Introduction */}
              <div className="mb-4">
                <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction
                </label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Short intro (optional)"
                />
                {errors.introduction && <p className="text-sm text-red-600 mt-1">{errors.introduction}</p>}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Detailed description (optional)"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded" />
                )}
                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
              </div>

              {/* Active Checkbox */}
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
                  {processing ? 'Creating...' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}