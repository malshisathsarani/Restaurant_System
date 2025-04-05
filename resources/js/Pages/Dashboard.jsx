import SideNavLinks from '@/lib/SideNavLinks';
import React from 'react';

export default function Dashboard({ businesses }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar Section */}
            <aside className="w-64 bg-gray-100">
                <SideNavLinks />
            </aside>
            
            {/* Main Content Section */}
            <main className="flex-1 p-4">
                <h1 className="text-2xl font-bold mb-4">Welcome To Café</h1>
                
                {/* Businesses Section */}
                <h2 className="text-xl font-semibold mb-2">Businesses</h2>
                <ul className="space-y-2">
                    {businesses && businesses.length > 0 ? (
                        businesses.map((business) => (
                            <li
                                key={business.id}
                                className="p-4 bg-white shadow rounded-md"
                            >
                                <h3 className="text-lg font-bold">{business.businessName}</h3>
                                <p className="text-sm text-gray-600">{business.address}</p>
                            </li>
                        ))
                    ) : (
                        <p>No businesses found.</p>
                    )}
                </ul>
            </main>
        </div>
    );
}