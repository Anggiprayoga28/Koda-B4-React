import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Edit, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import UserFormModal from '../components/admin/UserFormModal';
import { getUsers, createUser, updateUser, deleteUser } from '../services/apiService';

const UserListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = 'User List - Admin Panel | Coffee Shop';
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users from database');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredUsers = users.filter(user => {
    const fullName = user.full_name || user.fullName || user.name || '';
    const email = user.email || '';
    const searchLower = searchTerm.toLowerCase();
    return fullName.toLowerCase().includes(searchLower) || 
           email.toLowerCase().includes(searchLower);
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        const userId = selectedUser.id || selectedUser.user_id;
        await updateUser(userId, formData);
        showNotification('User updated successfully!', 'success');
      } else {
        await createUser(formData);
        showNotification('User added successfully!', 'success');
      }
      
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      showNotification(
        error.response?.data?.message || 'Failed to save user',
        'error'
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      showNotification('User deleted successfully!', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification(
        error.response?.data?.message || 'Failed to delete user',
        'error'
      );
    }
  };

  const columns = [
    {
      header: <input type="checkbox" className="rounded" />,
      render: () => <input type="checkbox" className="rounded" />
    },
    {
      header: "Image",
      render: (user) => (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {user.photo || user.photo_url || user.photoUrl ? (
            <img 
              src={user.photo || user.photo_url || user.photoUrl} 
              alt={user.full_name || user.fullName || user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    { 
      header: "Full Name",
      render: (user) => user.full_name || user.fullName || user.name || 'N/A'
    },
    { 
      header: "Phone", 
      render: (user) => user.phone || user.phone_number || 'N/A'
    },
    { 
      header: "Address", 
      render: (user) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {user.address ? (
            user.address.length > 50 
              ? `${user.address.substring(0, 50)}...`
              : user.address
          ) : 'N/A'}
        </span>
      )
    },
    { 
      header: "Email", 
      render: (user) => user.email || 'N/A'
    },
    {
      header: "Action",
      render: (user) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="View User"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            className="text-orange-500 hover:text-orange-600 transition-colors"
            title="Edit User"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteUser(user.id || user.user_id)}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="User List">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading users from database...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="User List">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User List">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name or email..."
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          {users.length !== filteredUsers.length && ` of ${users.length} total`}
        </div>
        <ActionButton 
          onClick={() => { 
            setSelectedUser(null); 
            setIsModalOpen(true); 
          }}
        >
          + Add User
        </ActionButton>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm ? 'No users found matching your search' : 'No users available'}
          </p>
          <p className="text-gray-400 text-sm">
            {searchTerm 
              ? 'Try adjusting your search term' 
              : 'Click "Add User" to create your first user'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <DataTable
              columns={columns}
              data={currentUsers}
              emptyMessage="No users found"
            />
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredUsers.length}
            />
          )}
        </>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </AdminLayout>
  );
};

export default UserListPage;