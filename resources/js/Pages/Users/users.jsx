import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import Sidebar from '@/lib/SideNavLinks';

export default function Users({ users }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users ? users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title="Users" />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Users</h1>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
              {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Businesses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-2">{user.name}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {user.businesses && user.businesses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.businesses.map(business => (
                                <Link 
                                  key={business.id} 
                                  href={`/dashboard/business/${business.id}/show`}
                                  className="px-2 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200"
                                >
                                  {business.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">No businesses</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  {!users || users.length === 0 ? (
                    <p>No users found.</p>
                  ) : (
                    <p>No users match your search.</p>
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