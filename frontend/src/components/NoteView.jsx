import React from 'react';
import { FiX, FiEdit2, FiTrash2, FiArrowLeft, FiArchive } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteView = ({ note, onClose, onEdit, onDelete, onArchive }) => {
  if (!note) return null;

  const getCategoryColor = (category) => {
    const colors = {
      personal: 'bg-green-500/20 text-green-400 border-green-500/30',
      work: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      ideas: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[category] || 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <FiArrowLeft size={20} />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded-lg transition-colors"
            title="Edit Note"
          >
            <FiEdit2 size={20} />
          </button>
          <button
            onClick={() => {
              if (onArchive) {
                onArchive(note.id);
                onClose();
              }
            }}
            className="p-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg transition-colors"
            title="Archive Note"
          >
            <FiArchive size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            title="Delete Note"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      {/* Note Content Card */}
      <div className="bg-[#272738] rounded-2xl shadow-xl p-8 border border-gray-700/30">
        {/* Category and Important Badge */}
        <div className="flex items-center space-x-3 mb-6">
          {note.category && (
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(note.category)}`}>
              {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
            </span>
          )}
          {note.isImportant && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium border border-yellow-500/30">
              <FaStar size={12} />
              <span>Important</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          {note.title}
        </h1>

        {/* Date */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-700/30">
          <span>
            Created: {new Date(note.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span>
              • Updated: {new Date(note.updatedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          {note.description ? (
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {note.description}
            </p>
          ) : (
            <p className="text-gray-500 italic">No description provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteView;
