import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {title && <h1 className="text-3xl font-bold mb-8">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;