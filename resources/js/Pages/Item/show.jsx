import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks';

export default function ShowItem({ item }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title={`Item: ${item.title}`} />
        <div className="p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with back button */}
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
              <Link
                href={route('dashboard.item')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Back to Items
              </Link>
            </div>
            
            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-2/5 p-6 flex items-center justify-center bg-gray-50">
                {item.image_path ? (
                  <img
                    src={`/storage/${item.image_path}`}
                    alt={item.title}
                    className="max-w-full max-h-80 object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Details Section */}
              <div className="md:w-3/5 p-6">
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* Two-column grid for details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Business</h2>
                    <p className="mt-1 text-base">{item.business ? item.business.name : 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Collection</h2>
                    <p className="mt-1 text-base">{item.collection ? item.collection.name : 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Created</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Last Updated</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(item.updated_at).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Introduction and Description span full width */}
                  {item.introduction && (
                    <div className="md:col-span-2">
                      <h2 className="text-sm font-medium text-gray-500">Introduction</h2>
                      <p className="mt-1 text-base">{item.introduction}</p>
                    </div>
                  )}
                  
                  {item.description && (
                    <div className="md:col-span-2">
                      <h2 className="text-sm font-medium text-gray-500">Description</h2>
                      <p className="mt-1 text-base whitespace-pre-line">{item.description}</p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <Link
                    href={route('dashboard.item.edit', item.id)}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}