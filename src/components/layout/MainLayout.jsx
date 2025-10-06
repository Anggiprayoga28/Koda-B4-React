import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../landing/Footer';
import WhatsAppFloating from '../ui/WhatsAppFloating';

const MainLayout = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      <WhatsAppFloating />
    </div>
  );
};

export default MainLayout;