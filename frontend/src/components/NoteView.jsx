import React from 'react';
import { FiX, FiEdit2, FiTrash2, FiArrowLeft, FiArchive } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteView = ({ note, onClose, onEdit, onDelete, onArchive }) => {
  if (!note) return null;

  const getCategoryColor = (category) => {
    return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
      onClose();
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6">
      {/* Header with Back Button */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
        >
          <FiArrowLeft size={18} className="sm:w-5 sm:h-5" />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(note)}
            className="h-10 w-10 flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 rounded-lg transition-colors"
            title="Edit Note"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => {
              if (onArchive) {
                onArchive(note.id);
                onClose();
              }
            }}
            className="h-10 w-10 flex items-center justify-center bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 rounded-lg transition-colors"
            title="Archive Note"
          >
            <FiArchive size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="h-10 w-10 flex items-center justify-center bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 rounded-lg transition-colors"
            title="Delete Note"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Note Content Card */}
      <div className="rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-800 backdrop-blur-sm">
        {/* Category and Important Badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {note.category && (
            <span className={`inline-block px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getCategoryColor(note.category)}`}>
              {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
            </span>
          )}
          {note.isImportant && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-xs sm:text-sm font-medium border border-yellow-500/30">
              <FaStar size={12} />
              <span>Important</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4 break-words">
          {note.title}
        </h1>

        {/* Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-800">
          <span>
            Created: {new Date(note.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span className="hidden sm:inline">
              • Updated: {new Date(note.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-invert max-w-none">
          {note.description ? (
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words">
              {note.description}
            </p>
          ) : (
            <p className="text-gray-500 italic text-sm sm:text-base">No description provided.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteView;
