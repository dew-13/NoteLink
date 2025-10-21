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
    <nav className="bg-gradient-to-r from-[#262a4a]/80 to-[#1e2139]/80 backdrop-blur-md shadow-lg border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl shadow-lg group-hover:shadow-primary-900/50 transition-all">
              <FiFileText className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
              NoteLink
            </span>
          </Link>

          <div className="flex items-center space-x-2">
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
