import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Link, router } from "@inertiajs/react";
import Sidebar from '@/lib/SideNavLinks';

export default function ShowBusiness({ business }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the business data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this business?')) {
      router.delete(`/dashboard/business/${business.id}`);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Head title={business.name || 'Business Details'} />
        
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/dashboard/business" 
              className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Businesses
            </Link>

            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="flex items-center space-x-6">
                  <div className="h-32 w-32 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                  <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                      {business.name}
                    </h1>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-8">
                      {/* Logo */}
                      <div className="w-full md:w-1/3">
                        <div className="bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square flex items-center justify-center">
                          {business.logo ? (
                            <img 
                              src={business.logo} 
                              alt={`${business.name} Logo`}
                              className="w-full h-full object-contain p-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Logo';
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 text-center p-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p>No Logo Available</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Business Info */}
                      <div className="w-full md:w-2/3">
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                          <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
                          
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Address</h3>
                              <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                                {business.address || 'No address provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={`/dashboard/business/${business.id}/edit`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Business
                          </Link>
                          
                          <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with metadata */}
                  <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created: {new Date(business.created_at).toLocaleDateString()}
                      </div>
                      {business.updated_at && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Updated: {new Date(business.updated_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Users Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Associated Users
                    </h2>
                    
                    {business.users && business.users.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {business.users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <Link href={`/dashboard/users/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <p className="text-gray-600">No users are associated with this business.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}