import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import { Head } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks';

export default function Collection({ collections }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter collections based on search term
  const filteredCollections = collections ? collections.filter(collection => 
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = (id, collectionName) => {
    if (confirm(`Are you sure you want to delete "${collectionName}"?`)) {
      setIsLoading(true);
      Inertia.delete(route('dashboard.collection.destroy', id), {
        onSuccess: () => setIsLoading(false),
        onError: () => {
          alert('Failed to delete the collection.');
          setIsLoading(false);
        }
      });
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Collections" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Collections</h1>
              <Link
                href={route('dashboard.collection.create')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create New
              </Link>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            {/* Collections Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
              {Array.isArray(filteredCollections) && filteredCollections.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Business</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollections.map((collection) => (
                      <tr key={collection.id} className="border-t">
                        <td className="px-4 py-2">
                          {collection.name}
                        </td>
                        <td className="px-4 py-2">
                          {collection.business ? collection.business.name : 'N/A'}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${collection.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {collection.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/dashboard/collection/${collection.id}/show`}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              View
                            </Link>
                            <Link
                              href={`/dashboard/collection/${collection.id}/edit`}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(collection.id, collection.name)}
                              disabled={isLoading}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  {!collections || collections.length === 0 ? (
                    <p>No collections yet. <Link href="/dashboard/collection/create" className="text-blue-600">Create one</Link>.</p>
                  ) : (
                    <p>No results match your search.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}