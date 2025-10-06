import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    navigate('/profile');
    setIsProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <Logo />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`hover:text-white transition-colors font-medium pb-1 ${
                isActive('/') ? 'text-white border-b-2 border-orange-500' : 'text-gray-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/product"
              className={`hover:text-white transition-colors font-medium pb-1 ${
                isActive('/product') ? 'text-white border-b-2 border-orange-500' : 'text-gray-400'
              }`}
            >
              Product
            </Link>
            {user && (
              <Link 
                to="/history-order"
                className={`hover:text-white transition-colors font-medium pb-1 ${
                  isActive('/history-order') ? 'text-white border-b-2 border-orange-500' : 'text-gray-400'
                }`}
              >
                History Order
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="hover:text-white transition-colors text-gray-400">
              <Search className="w-5 h-5" />
            </button>
            <button className="hover:text-white transition-colors text-gray-400">
              <ShoppingCart className="w-5 h-5" />
            </button>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center border-2 border-gray-600">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white">{user.fullName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="border border-white text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors font-semibold"
                >
                  SignIn
                </Link>
                <Link 
                  to="/register"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-4 space-y-3">
          <Link 
            to="/" 
            className="block hover:text-orange-500 w-full text-left text-gray-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/product" 
            className="block hover:text-orange-500 w-full text-left text-gray-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Product
          </Link>
          {user && (
            <>
              <Link 
                to="/history-order" 
                className="block hover:text-orange-500 w-full text-left text-gray-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                History Order
              </Link>
              <Link 
                to="/profile" 
                className="block hover:text-orange-500 w-full text-left text-gray-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
          {user ? (
            <button 
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }} 
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login"
                className="block w-full border border-white text-white px-4 py-2 rounded-lg mb-2 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                SignIn
              </Link>
              <Link 
                to="/register"
                className="block w-full bg-orange-500 text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;