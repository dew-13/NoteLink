import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMenu } from 'react-icons/fi';

const Navbar = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-black shadow-lg border-b border-gray-800">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="flex items-center h-16 gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            {location.pathname === '/dashboard' && onMenuClick && (
              <button
                onClick={onMenuClick}
                className="md:hidden h-10 w-10 flex items-center justify-center rounded-lg transition-colors"
                title="Toggle menu"
              >
                <FiMenu size={20} className="text-white" />
              </button>
            )}
            <Link to="/" className="flex items-center group">
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            {currentUser ? (
              <>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors px-3 py-2 rounded-lg"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="btn-primary text-xs sm:text-sm py-2 px-3"
                  >
                    Sign Up
                  </Link>
                )}
              </>
            )}
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="text-xs sm:text-sm text-gray-300">
                Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
              </span>
              <button
                className="h-10 w-10 rounded-full flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
                title={currentUser.email}
              >
                <FiUser size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
