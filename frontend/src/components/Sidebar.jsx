import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBriefcase, FiArchive, FiGrid, FiTrash2, FiX, FiLogOut } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { HiLightBulb } from 'react-icons/hi';

const Sidebar = ({ activeCategory, onCategoryChange, notesCount, isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const categories = [
    { id: 'all', name: 'All Notes', icon: FiGrid },
    { id: 'personal', name: 'Personal', icon: FiUser },
    { id: 'work', name: 'Work', icon: FiBriefcase },
    { id: 'ideas', name: 'Ideas', icon: HiLightBulb },
    { id: 'important', name: 'Important', icon: FaStar },
    { id: 'archived', name: 'Archived', icon: FiArchive },
  ];

  const handleCategoryClick = (id) => {
    onCategoryChange(id);
    // Close sidebar on mobile after selection
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40
        w-20 md:w-24 bg-black border-r border-gray-800
        p-2 md:p-2.5 flex flex-col items-center transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col items-center space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                title={category.name}
                className={`h-9 w-9 flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'text-yellow-400' 
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        {/* Bin at Bottom */}
        <div className="mt-auto pt-2 border-t border-gray-800 space-y-1">
          <button
            onClick={() => handleCategoryClick('bin')}
            title="Bin"
            className={`h-9 w-9 flex items-center justify-center transition-colors ${
              activeCategory === 'bin'
                ? 'text-yellow-400' 
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <FiTrash2 size={18} />
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
