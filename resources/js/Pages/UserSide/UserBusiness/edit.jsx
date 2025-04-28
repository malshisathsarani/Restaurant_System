import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, business }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // Laravel uses this to override the POST method
        business_name: business ? business.name : '',
        logo: null,
        address: business ? business.address : '',
        description: business ? business.description : '',
    });

    const [logoPreview, setLogoPreview] = useState(business && business.logo ? `/storage/${business.logo}` : null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);
        
        post(route('dashboard.userbusiness.update', business.id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Form submitted successfully, redirecting...');
                // Use Inertia's visit method for a proper page refresh
                window.location.href = route('dashboard.userbusiness') + '?updated=' + new Date().getTime();
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Business</h2>}
        >
            <Head title="Edit Business" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-gray-900">
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-gray-800">Update Your Business Information</h2>
                                <p className="text-gray-600 mt-2">Make changes to your business profile below.</p>
                            </div>
                            
                            <form onSubmit={submit} className="max-w-xl mx-auto">
                                {/* Business Name */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="business_name" value="Business Name" />
                                    <TextInput
                                        id="business_name"
                                        type="text"
                                        name="business_name"
                                        value={data.business_name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.business_name} className="mt-2" />
                                    <div className="text-sm text-gray-500 mt-2">
                                        This is the name customers will see when they visit your Business online.
                                    </div>
                                </div>
                                
                                {/* Business Logo */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="logo" value="Business Logo" />
                                    <input
                                        id="logo"
                                        type="file"
                                        name="logo"
                                        onChange={handleLogoChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        accept="image/*"
                                    />
                                    
                                    {logoPreview && (
                                        <div className="mt-4 flex justify-center">
                                            <img 
                                                src={logoPreview} 
                                                alt="Logo Preview" 
                                                className="h-40 object-contain border rounded-md shadow-sm" 
                                            />
                                        </div>
                                    )}
                                    
                                    {!logoPreview && (
                                        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">Drag and drop an image or click to browse</p>
                                        </div>
                                    )}
                                    
                                    <InputError message={errors.logo} className="mt-2" />
                                    <div className="text-sm text-gray-500 mt-2">
                                        A high-quality logo helps customers recognize and remember your brand.
                                    </div>
                                </div>
                                
                                {/* Business Address - Added field */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="address" value="Business Address" />
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="3"
                                        required
                                    />
                                    <InputError message={errors.address} className="mt-2" />
                                    <div className="text-sm text-gray-500 mt-2">
                                        This is where customers will find your business.
                                    </div>
                                </div>
                                
                                {/* Business Description */}
                                <div className="mb-6">
                                    <InputLabel htmlFor="description" value="Business Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        placeholder="Tell customers what makes your Business special..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                                
                                <div className="flex items-center justify-end mt-8">
                                    <PrimaryButton disabled={processing}>
                                        Save Changes
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}