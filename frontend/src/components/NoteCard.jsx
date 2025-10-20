import React from 'react';
import { FiX } from 'react-icons/fi';

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="card relative group">
      <button
        onClick={() => onDelete(note.id)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
        title="Delete note"
      >
        <FiX size={20} />
      </button>
      
      <div onClick={() => onEdit(note)} className="cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
          {note.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {note.description || 'No description'}
        </p>
        <div className="mt-4 text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
