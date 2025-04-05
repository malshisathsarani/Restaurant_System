import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import { Head } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks'; // Import sidebar as you did in the show page

export default function Business({ businesses }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter businesses based on search term
  const filteredBusinesses = businesses ? businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setIsLoading(true);
      Inertia.delete(route('dashboard.business.destroy', id), {
        onSuccess: () => setIsLoading(false),
        onError: () => {
          alert('Failed to delete the business.');
          setIsLoading(false);
        }
      });
    }
  };

  // Make sure the component returns JSX
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Businesses" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Businesses</h1>
              <Link
                href={route('dashboard.business.create')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create New
              </Link>
            </div>

            {/* Rest of your component... */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              {Array.isArray(filteredBusinesses) && filteredBusinesses.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Address</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBusinesses.map((business) => (
                      <tr key={business.id} className="border-t">
                        <td className="px-4 py-2">
                          {business.name}
                        </td>
                        <td className="px-4 py-2 max-w-xs truncate">
                          {business.address}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/dashboard/business/${business.id}/show`}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              View
                            </Link>
                            <Link
                              href={`/dashboard/business/${business.id}/edit`}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(business.id, business.name)}
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
                  {!businesses || businesses.length === 0 ? (
                    <p>No businesses yet. <Link href="/dashboard/business/create" className="text-blue-600">Create one</Link>.</p>
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