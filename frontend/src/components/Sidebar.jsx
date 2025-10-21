import React from 'react';
import { FiHome, FiFolder, FiArchive, FiGrid, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { HiLightBulb } from 'react-icons/hi';

const Sidebar = ({ activeCategory, onCategoryChange, notesCount }) => {
  const categories = [
    { id: 'all', name: 'All Notes', icon: FiGrid },
    { id: 'personal', name: 'Personal', icon: FiHome },
    { id: 'work', name: 'Work', icon: FiFolder },
    { id: 'ideas', name: 'Ideas', icon: HiLightBulb },
    { id: 'important', name: 'Important', icon: FaStar },
    { id: 'archived', name: 'Archived', icon: FiArchive },
  ];

  return (
    <aside className="w-20 bg-[#2563EB] border-r border-blue-600/30 min-h-[calc(100vh-4rem)] p-3 flex flex-col">
      <div className="flex-1">
        <div className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                title={category.name}
                className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-lg shadow-black/20' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="text-2xl" />
                {notesCount && notesCount[category.id] > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {notesCount[category.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bin at Bottom */}
      <div className="mt-auto pt-3 border-t border-white/20">
        <button
          onClick={() => onCategoryChange('bin')}
          title="Bin"
          className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
            activeCategory === 'bin'
              ? 'bg-white/20 text-white shadow-lg shadow-black/20' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <FiTrash2 className="text-2xl" />
          {notesCount && notesCount.bin > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {notesCount.bin}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
