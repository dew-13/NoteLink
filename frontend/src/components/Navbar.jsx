import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiFileText, FiUser } from 'react-icons/fi';

const Navbar = () => {
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
    <nav className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] shadow-lg border-b border-blue-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          <Link to="/" className="flex items-center group">
            <span className="text-xl font-bold text-white">
              NoteLink
            </span>
          </Link>

          <div className="flex items-center space-x-2 absolute right-0">
            {currentUser ? (
              <>
                <button
                  className="p-2.5 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-primary-600 hover:text-white transition-all backdrop-blur-sm"
                  title={currentUser.email}
                >
                  <FiUser size={20} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-red-600 hover:text-white transition-all backdrop-blur-sm"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-primary-400 transition-colors px-4 py-2 rounded-xl hover:bg-gray-700/30"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
