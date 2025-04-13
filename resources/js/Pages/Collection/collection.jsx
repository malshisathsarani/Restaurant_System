import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import { Head } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks';

export default function Collection({ collections }) {
  console.log('Collections detailed:', collections.map(c => ({
    id: c.id,
    name: c.name,
    business: c.business,
    has_business: !!c.business
  })));

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Create a set of parent collection IDs that were auto-created
  const autoCreatedParentIds = new Set();
  collections.forEach(collection => {
    // If this was auto-created as a parent AND has description "Auto-created parent category"
    if (collection.description === 'Auto-created parent category') {
      autoCreatedParentIds.add(collection.id);
    }
  });

  // Filter collections to exclude auto-created parents
  const displayCollections = collections.filter(collection => 
    !autoCreatedParentIds.has(collection.id) || 
    (collection.parent_id) // Keep if it's both a parent and a child
  );

   // Apply search filter to the already-filtered collections
   const filteredCollections = displayCollections
   ? displayCollections.filter((collection) =>
       collection.name.toLowerCase().includes(searchTerm.toLowerCase())
     )
   : [];

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Delete?',
      text: `Delete "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#3B82F6',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        Inertia.delete(route('dashboard.collection.destroy', id), {
          onSuccess: () => {
            setIsLoading(false);
            Swal.fire('Deleted!', 'Collection deleted.', 'success');
          },
          onError: () => {
            setIsLoading(false);
            Swal.fire('Error', 'Failed to delete.', 'error');
          },
        });
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - If you have one */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Head title="Collections" />
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Collections</h1>
          <Link 
            href={route('dashboard.collection.create')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Collection
          </Link>
        </div>

        {/* Search and filters */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : filteredCollections.length > 0 ? (
            <div className="overflow-x-auto">
           
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Collection
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCollections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{collection.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {collection.parent ? collection.parent.name : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {collection.business ? collection.business.name : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          collection.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {collection.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {/* Actions remain unchanged */}
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={route('dashboard.collection.show', { id: collection.id })}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={route('dashboard.collection.edit', { id: collection.id })}
                            className="text-amber-600 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(collection.id, collection.name)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No collections found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new collection.</p>
              <div className="mt-6">
                <Link
                  href={route('dashboard.collection.create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Collection
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}