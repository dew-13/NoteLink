import React from 'react';
import { FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const BinNoteCard = ({ note, onRestore, onPermanentDelete, viewMode = 'grid' }) => {
  const getCategoryColor = (category) => {
    return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
  };

  const getDaysRemaining = () => {
    const deletedDate = new Date(note.deletedAt);
    const expiryDate = new Date(deletedDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    const today = new Date();
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  if (viewMode === 'list') {
    return (
      <div className="card relative group opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {note.category && (
                <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-medium border ${getCategoryColor(note.category)}`}>
                  {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                </span>
              )}
              {note.isImportant && (
                <FaStar className="text-yellow-400 text-sm sm:text-base" title="Important" />
              )}
              <span className="text-xs text-gray-400 bg-gray-700/20 border border-gray-700/50 rounded-lg px-2 py-0.5">
                {getDaysRemaining()}d
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
                onRestore(note.id);
              }}
              className="h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-700/30 rounded transition-colors"
              title="Restore note"
            >
              <FiRotateCcw size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Permanently delete this note? This action cannot be undone!')) {
                  onPermanentDelete(note.id);
                }
              }}
              className="h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-700/30 rounded transition-colors"
              title="Permanently delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card relative group opacity-70 hover:opacity-100 transition-opacity">
      <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
        {note.isImportant && (
          <FaStar className="text-yellow-400 text-sm sm:text-base" title="Important" />
        )}
      </div>
      
      <div>
        {note.category && (
          <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-medium mb-2 sm:mb-3 border ${getCategoryColor(note.category)}`}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-1 sm:mb-2 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-2 sm:mb-3">
          {note.description || 'No description'}
        </p>

        {/* Days Remaining */}
        <div className="mb-2 sm:mb-3 text-xs text-gray-400 bg-gray-700/20 border border-gray-700/50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <span className="font-semibold">
            {getDaysRemaining()} day{getDaysRemaining() !== 1 ? 's' : ''}
          </span> left
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore(note.id);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 rounded-lg transition-colors text-xs sm:text-sm"
            title="Restore note"
          >
            <FiRotateCcw size={16} />
            <span className="hidden sm:inline">Restore</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Permanently delete? This cannot be undone!')) {
                onPermanentDelete(note.id);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700/20 hover:bg-gray-700/30 text-gray-400 rounded-lg transition-colors text-xs sm:text-sm"
            title="Permanently delete"
          >
            <FiTrash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-800 text-xs text-gray-500">
          Deleted {new Date(note.deletedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default BinNoteCard;
