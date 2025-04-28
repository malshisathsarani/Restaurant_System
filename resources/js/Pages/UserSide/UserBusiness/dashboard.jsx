import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard({ auth, businesses }) {
    // For demo purposes, use the first business if multiple exist
    const business = businesses && businesses.length > 0 ? businesses[0] : null;
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{business ? business.name + "'s" : "Your Restaurant"} Dashboard</h2>}
        >
            <Head title="Restaurant Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Two Buttons */}
                    <div className="flex justify-end gap-4 mb-6">
                    <Link 
                        href={route('dashboard.collection.create') + `?business_id=${business ? business.id : 1}`}
                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:outline-none transition ease-in-out duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Collection
                    </Link>

                    <Link 
                        href={route('dashboard.item.create') + `?business_id=${business ? business.id : 1}`} 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none transition ease-in-out duration-150"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Item
                    </Link>
                </div>
                    {/* Business Information Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="flex items-start space-x-6 flex-1">
                                    <div className="flex-shrink-0">
                                        {business && business.logo ? (
                                            <img 
                                                src={`/storage/${business.logo}`} 
                                                alt={`${business.name} Logo`}
                                                className="h-24 w-24 object-contain border rounded-md" 
                                            />
                                        ) : (
                                            <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded-md border">
                                                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {business ? business.name : 'Your Restaurant Name'}
                                        </h2>
                                        <p className="text-gray-600 mt-2">
                                            {business && business.description 
                                                ? business.description 
                                                : 'No description available. Add details about your restaurant to let customers know what makes it special.'}
                                        </p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            <p>
                                                <strong>Address:</strong> {business && business.address 
                                                    ? business.address 
                                                    : 'No address specified'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <Link 
                                    href={route('dashboard.userbusiness.edit', business ? business.id : 1)} 
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none transition ease-in-out duration-150"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Business
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Welcome message for better user experience */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to {business ? business.name + "'s" : "Your Business"}</h3>
                                <p className="text-gray-600">
                                    This is your central hub for managing your Business. 
                                    Soon you'll be able to add collections, items, and more.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}