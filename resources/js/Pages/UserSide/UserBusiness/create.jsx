import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ auth, businessName = '' }) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    const { data, setData, post, processing, errors } = useForm({
        business_action: 'create',
        business_name: businessName || '',
        logo: null,
        address: '',
        description: '',
    });

    const [logoPreview, setLogoPreview] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const nextStep = () => {
        setCurrentStep(Math.min(currentStep + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(Math.max(currentStep - 1, 1));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('dashboard.userbusiness.store'), {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect to dashboard after successful submission
                window.location.href = route('dashboard.userbusiness');
            }
        });
    };

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="space-y-6 welcome-step">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-indigo-600 mb-4">Welcome to Your Business Journey!</h2>
                            <p className="text-lg text-gray-600">We're excited to help you set up your business. Let's get started by entering your business name.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto">
                            <InputLabel htmlFor="business_name" value="Business Name" />
                            <TextInput
                                id="business_name"
                                type="text"
                                name="business_name"
                                value={data.business_name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('business_name', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.business_name} className="mt-2" />
                            
                            <div className="text-sm text-gray-500 mt-2">
                                This is the name customers will see when they visit your Business online.
                            </div>
                        </div>
                    </div>
                );
            
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-indigo-600 mb-4">Create Your Brand Identity</h2>
                            <p className="text-lg text-gray-600">Upload a logo that represents your buiness's unique style.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto">
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
                    </div>
                );
                
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-indigo-600 mb-4">Where Can Customers Find You?</h2>
                            <p className="text-lg text-gray-600">Add your business location and a brief description.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto">
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
                            
                            <div className="mt-6">
                                <InputLabel htmlFor="description" value="Business Description" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    placeholder="Tell customers what makes your restaurant special..."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Your Business</h2>}
        >
            <Head title="Setup Your Business" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-gray-900">
                            {/* Progress Bar */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="flex flex-col items-center">
                                            <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${currentStep >= step ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-500'}`}>
                                                {step}
                                            </div>
                                            <div className="text-xs mt-1 text-gray-500">
                                                {step === 1 && 'Business Info'}
                                                {step === 2 && 'Logo'}
                                                {step === 3 && 'Location'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
                                </div>
                            </div>
                            
                            <form onSubmit={currentStep === totalSteps ? submit : (e) => { e.preventDefault(); nextStep(); }}>
                                {renderStep()}
                                
                                <div className="flex items-center justify-between mt-10">
                                    {currentStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            Back
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                    
                                    <PrimaryButton disabled={processing}>
                                        {currentStep === totalSteps ? 'Complete Setup' : 'Continue'}
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