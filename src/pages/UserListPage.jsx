import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Edit, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import SearchFilter from '../components/admin/SearchFilter';
import DataTable from '../components/admin/DataTable';
import Pagination from '../components/admin/Pagination';
import ActionButton from '../components/admin/ActionButton';
import UserFormModal from '../components/admin/UserFormModal';

const UserListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, []);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (currentPage > 1) params.page = currentPage.toString();
    
    setSearchParams(params);
  }, [searchTerm, currentPage, setSearchParams]);

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveUser = (formData) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (selectedUser) {
      const updatedUsers = allUsers.map(u => 
        u.email === selectedUser.email ? { ...u, ...formData } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      alert('User updated successfully!');
    } else {
      const existingUser = allUsers.find(u => u.email === formData.email);
      if (existingUser) {
        alert('Email already exists!');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      allUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(allUsers));
      setUsers(allUsers);
      alert('User added successfully!');
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = allUsers.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      alert('User deleted successfully!');
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
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    { header: "Full Name", accessor: "fullName" },
    { header: "Phone", render: (user) => user.phone || '(205) 555-0100' },
    { header: "Address", render: (user) => user.address || 'N/A' },
    { header: "Email", accessor: "email" },
    {
      header: "Action",
      render: (user) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="User List">
      <Helmet>
        <title>User List - Admin Panel | Coffee Shop</title>
        <meta name="description" content="Manage coffee shop users - view, edit, and manage customer accounts" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          placeholder="Enter User Name"
          extraFilters={<div className="text-sm text-gray-600">Search User</div>}
        />
      </div>

      <ActionButton onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}>
        Add User
      </ActionButton>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={currentUsers}
          emptyMessage="No users found"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
        />
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </AdminLayout>
  );
};

export default UserListPage;