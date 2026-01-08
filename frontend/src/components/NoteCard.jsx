import React, { useState } from 'react';
import { FiX, FiArchive } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteCard = ({ note, onEdit, onDelete, onView, onArchive, viewMode = 'grid' }) => {
  const [showActions, setShowActions] = useState(false);

  const getCategoryColor = (category) => {
    return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
  };

  if (viewMode === 'list') {
    return (
      <div className="card relative group hover:scale-[1.01] transition-transform">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div onClick={() => onView ? onView(note) : onEdit(note)} className="cursor-pointer flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {note.category && (
                <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-medium border ${getCategoryColor(note.category)}`}>
                  {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                </span>
              )}
              {note.isImportant && (
                <FaStar className="text-yellow-400 text-sm sm:text-base" title="Important" />
              )}
              <span className="text-xs text-gray-500">
                {new Date(note.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1 truncate">
              {note.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {note.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onArchive) onArchive(note.id);
              }}
              className="h-8 w-8 flex items-center justify-center opacity-0 sm:opacity-0 sm:group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-400 rounded"
              title="Archive note"
            >
              <FiArchive size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="h-8 w-8 flex items-center justify-center opacity-0 sm:opacity-0 sm:group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-400 rounded"
              title="Delete note"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card relative group hover:scale-105 transition-transform touch-none"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Actions - Always visible on mobile, hover on desktop */}
      <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 md:top-4 md:right-4 flex items-center gap-1 sm:gap-2 z-10 transition-opacity ${
        showActions ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
      }`}>
        {note.isImportant && (
          <FaStar className="text-yellow-400 text-sm sm:text-base" title="Important" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onArchive) onArchive(note.id);
          }}
          className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-400 rounded transition-colors"
          title="Archive note"
        >
          <FiArchive size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-gray-400 rounded transition-colors"
          title="Delete note"
        >
          <FiX size={18} />
        </button>
      </div>
      
      <div onClick={() => onView ? onView(note) : onEdit(note)} className="cursor-pointer">
        {note.category && (
          <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-medium mb-2 sm:mb-3 border ${getCategoryColor(note.category)}`}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1 sm:mb-2 pr-16 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {note.description || 'No description'}
        </p>
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
