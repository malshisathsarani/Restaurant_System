import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '@/lib/SideNavLinks';

export default function EditItem({ item, businesses, collections, csrf }) {
  const [formData, setFormData] = useState({
    business_id: item.business_id || '',
    collection_id: item.collection_id || '',
    title: item.title || '',
    introduction: item.introduction || '',
    description: item.description || '',
    active: item.active || false,
    image: null,
  });

  const [availableCollections, setAvailableCollections] = useState(collections || []);
  const [imagePreview, setImagePreview] = useState(
    item.image_path ? `/storage/${item.image_path}` : null
  );
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch collections when business is selected
  useEffect(() => {
    if (formData.business_id && formData.business_id !== item.business_id) {
      fetch(`/api/collections/${formData.business_id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Fetched collections:", data);
          setAvailableCollections(data);
        })
        .catch(err => {
          console.error("Error fetching collections:", err);
          setAvailableCollections([]);
          setFormData(prev => ({ ...prev, collection_id: '' }));
        });
    }
  }, [formData.business_id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (files[0]) {
        setFormData({
          ...formData,
          [name]: files[0]
        });
        
        // Create preview for image
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
  
    const submitData = new FormData();
    
    // Add method override for PUT request
    submitData.append('_method', 'PUT');
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        if(key === 'active'){
          submitData.append(key, value ? '1' : '0');
        } else {
          submitData.append(key, value);
        }
      }
    });
  
    axios.post(`/dashboard/item/${item.id}`, submitData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-TOKEN': csrf,
        'Accept': 'application/json'
      }
    })
    .then(response => {
      Swal.fire({
        title: 'Success!',
        text: 'Item updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        Inertia.visit('/dashboard/item');
      });
    })
    .catch(error => {
      console.error("Validation errors:", error.response?.data?.errors);
      setErrors(error.response?.data?.errors || {});
      setProcessing(false);
    });
  };

  const handleCancel = () => {
    Inertia.visit('/dashboard/item');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Head title="Edit Item" />
        <div className="p-6">
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
            <h1 className="text-xl font-bold mb-4">Edit Item</h1>

            <form onSubmit={handleSubmit}>
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

              <div className="mb-4">
                <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction
                </label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-20"
                  placeholder="Short intro (optional)"
                />
                {errors.introduction && <p className="text-sm text-red-600 mt-1">{errors.introduction}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-24"
                  placeholder="Detailed description (optional)"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

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
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Current image:</p>
                    <img src={imagePreview} alt="Preview" className="max-h-40 rounded" />
                  </div>
                )}
                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
              </div>

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
                  {processing ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}