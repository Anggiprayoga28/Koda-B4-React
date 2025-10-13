import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';

/**
 * @param {Object} user - Current user object
 * @param {Function} onLogout - Logout handler
 */

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
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Logo />
            </Link>
            
            {/* Desktop Menu */}
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
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 md:hidden overflow-y-auto shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Logo />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Search Product</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Find Product"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="px-4 py-2">
              <Link 
                to="/" 
                className={`block py-3 px-2 text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-gray-900 border-b-2 border-orange-500' 
                    : 'text-gray-700 hover:text-orange-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/product" 
                className={`block py-3 px-2 text-base font-medium transition-colors ${
                  isActive('/product') 
                    ? 'text-gray-900 border-b-2 border-orange-500' 
                    : 'text-gray-700 hover:text-orange-500'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Product
              </Link>
              {user && (
                <>
                  <Link 
                    to="/history-order" 
                    className={`block py-3 px-2 text-base font-medium transition-colors ${
                      isActive('/history-order') 
                        ? 'text-gray-900 border-b-2 border-orange-500' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    History Order
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`block py-3 px-2 text-base font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'text-gray-900 border-b-2 border-orange-500' 
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              {user ? (
                <>
                  {user.photoUrl || user.fullName ? (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        {user.photoUrl ? (
                          <img 
                            src={user.photoUrl} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <button 
                    onClick={handleLogout} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login"
                    className="block w-full border-2 border-gray-900 text-gray-900 px-4 py-3 rounded-lg text-center font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SignIn
                  </Link>
                  <Link 
                    to="/register"
                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg text-center font-semibold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;