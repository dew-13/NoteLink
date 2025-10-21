import React from 'react';
import { FiX, FiArchive } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteCard = ({ note, onEdit, onDelete, onView, onArchive }) => {
  const getCategoryColor = (category) => {
    const colors = {
      personal: 'bg-green-500/20 text-green-400 border-green-500/30',
      work: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      ideas: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      important: 'bg-red-500/20 text-red-400 border-red-500/30',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[category] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="card relative group hover:scale-105">
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {note.isImportant && (
          <FaStar className="text-yellow-400" size={16} title="Important" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onArchive) onArchive(note.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-orange-500"
          title="Archive note"
        >
          <FiArchive size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
          title="Delete note"
        >
          <FiX size={20} />
        </button>
      </div>
      
      <div onClick={() => onView ? onView(note) : onEdit(note)} className="cursor-pointer">
        {note.category && (
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-3 border ${getCategoryColor(note.category)}`}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-100 mb-2 pr-8">
          {note.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
          {note.description || 'No description'}
        </p>
        <div className="mt-4 pt-3 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-500">
          <span>
            {new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
