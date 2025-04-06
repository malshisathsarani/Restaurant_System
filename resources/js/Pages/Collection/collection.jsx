import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';

export default function Collection({ collections }) 
  {

  console.log('Collections:', collections);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredCollections = collections
    ? collections.filter((collection) =>
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
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Collections</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '6px', marginBottom: '10px', width: '100%' }}
      />

      {/* Create Button */}
      <div style={{ marginBottom: '10px' }}>
        <Link href={route('dashboard.collection.create')}>
          <button style={{ padding: '6px 12px' }}>+ Create New</button>
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : filteredCollections.length > 0 ? (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Business</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.map((collection) => (
              <tr key={collection.id}>
                <td>{collection.name}</td>
                <td>{collection.business_name || 'N/A'}</td>
                <td>{collection.active ? 'Active' : 'Inactive'}</td>
                <td>
                  {/* Fix the View link formatting */}
                  <Link href={route('dashboard.collection.show', { id: collection.id })}>View</Link> |{' '}
                  <Link href={route('dashboard.collection.edit', { id: collection.id })}>Edit</Link> |{' '}
                  <button onClick={() => handleDelete(collection.id, collection.name)} disabled={isLoading}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No collections found.</p>
      )}
    </div>
  );
}
