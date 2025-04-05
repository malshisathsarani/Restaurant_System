import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Head } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks'; // Import sidebar component

export default function Business() {
  const [formData, setFormData] = useState({
    name: '', // Changed to "name" to match Laravel
    logo: '',
    address: '',
  });

  const [focused, setFocused] = useState({
    name: false,
    logo: false,
    address: false,
  });

  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    axios
      .post('/dashboard/business/store', formData)
      .then((response) => {
        Swal.fire({
          icon: 'success',
          title: 'Business Added!',
          text: 'The business details were saved successfully.',
          confirmButtonText: 'OK',
        });
        setFormData({
          name: '',
          logo: '',
          address: '',
        });
        setErrors({});
        setProcessing(false);
      })
      .catch((error) => {
        if (error.response) {
          console.error('Validation errors:', error.response.data);
          setErrors(error.response.data.errors || {});
        } else {
          console.error('Error', error.message);
        }
        setProcessing(false);
      });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Add New Business" />
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Add New Business
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-2 ${
                    focused.name ? 'text-blue-600 translate-x-1' : 'text-gray-700'
                  }`}
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, name: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, name: false }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-300 outline-none ${
                    focused.name ? 'border-blue-500 shadow-md shadow-blue-100' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="Enter business name"
                />
                {errors.name && <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.name}</div>}
              </div>

              {/* Logo */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="logo"
                  className={`block text-sm font-medium mb-2 ${
                    focused.logo ? 'text-blue-600 translate-x-1' : 'text-gray-700'
                  }`}
                >
                  Logo (Image URL)
                </label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, logo: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, logo: false }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-300 outline-none ${
                    focused.logo ? 'border-blue-500 shadow-md shadow-blue-100' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="Enter logo URL"
                />
                {errors.logo && <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.logo}</div>}
              </div>

              {/* Address */}
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label
                  htmlFor="address"
                  className={`block text-sm font-medium mb-2 ${
                    focused.address ? 'text-blue-600 translate-x-1' : 'text-gray-700'
                  }`}
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, address: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, address: false }))}
                  className={`w-full px-4 py-3 border-2 rounded-lg bg-white/80 backdrop-blur-sm transition-all duration-300 outline-none h-32 resize-none ${
                    focused.address ? 'border-blue-500 shadow-md shadow-blue-100' : 'border-gray-200 hover:border-blue-200'
                  }`}
                  placeholder="Enter address"
                ></textarea>
                {errors.address && <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.address}</div>}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-6 space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow transform hover:-translate-y-1"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`group relative overflow-hidden px-8 py-3 rounded-lg text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                    processing
                      ? 'bg-blue-400'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {processing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Save Business
                        <svg
                          className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}