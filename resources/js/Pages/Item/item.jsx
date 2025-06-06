// resources/js/Pages/Item/index.jsx
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import Sidebar from '@/lib/SideNavLinks';

export default function ItemIndex({ items }) {
  console.log('Items received:', items);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = items
    ? items.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDelete = (id, title) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        Inertia.delete(route('dashboard.item.destroy', id), {
          onSuccess: () => {
            setIsLoading(false);
            Swal.fire(
              'Deleted!',
              'Item has been deleted.',
              'success'
            );
          },
          onError: () => {
            setIsLoading(false);
            Swal.fire(
              'Error',
              'Failed to delete the item.',
              'error'
            );
          }
        });
      }
    });
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Items" />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Items</h1>
              <button
                onClick={() => Inertia.visit(route('dashboard.item.create'))}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create New
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            {/* Items Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Loading...</p>
                </div>
              ) : Array.isArray(filteredItems) && filteredItems.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Image</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Business</th>
                      <th className="px-4 py-2 text-left">Collection</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">
                          {item.image_path ? (
                            <img 
                              src={`/storage/${item.image_path}`} 
                              alt={item.title} 
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">{item.title}</td>
                        <td className="px-4 py-2">{item.business ? item.business.name : 'N/A'}</td>
                        <td className="px-4 py-2">{item.collection ? item.collection.name : 'N/A'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={route('dashboard.item.show', item.id)}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              View
                            </Link>
                            <Link
                              href={route('dashboard.item.edit', item.id)}
                              className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
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
                  {!items || items.length === 0 ? (
                    <p>No items yet. <Link href={route('dashboard.item.create')} className="text-blue-600">Create one</Link>.</p>
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