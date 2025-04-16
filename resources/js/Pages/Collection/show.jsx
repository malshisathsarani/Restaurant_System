// resources/js/Pages/Collection/show.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks';

export default function Show({ collection }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Head title={`View Collection: ${collection.name}`} />
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Collection Details</h1>
            <Link 
              href={route('dashboard.collection')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Collections
            </Link>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Name</h2>
            <p>{collection.name}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p>{collection.description}</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Business</h2>
            <p>{collection.business.name || 'N/A'}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Status</h2>
            <span className={`px-2 py-1 rounded text-xs ${collection.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {collection.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              href={route('dashboard.collection.edit', { id: collection.id })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}