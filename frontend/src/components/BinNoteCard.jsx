import React from 'react';
import { FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const BinNoteCard = ({ note, onRestore, onPermanentDelete, viewMode = 'grid' }) => {
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {note.category && (
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(note.category)}`}>
                  {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                </span>
              )}
              {note.isImportant && (
                <FaStar className="text-yellow-400" size={16} title="Important" />
              )}
              <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
                {getDaysRemaining()} day{getDaysRemaining() !== 1 ? 's' : ''} left
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              {note.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {note.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(note.id);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
              title="Restore note"
            >
              <FiRotateCcw size={16} />
              <span className="text-sm font-medium">Restore</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Permanently delete this note? This action cannot be undone!')) {
                  onPermanentDelete(note.id);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
              title="Permanently delete"
            >
              <FiTrash2 size={16} />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card relative group opacity-70 hover:opacity-100 transition-opacity">
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {note.isImportant && (
          <FaStar className="text-yellow-400" size={16} title="Important" />
        )}
      </div>
      
      <div>
        {note.category && (
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-3 border ${getCategoryColor(note.category)}`}>
            {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-100 mb-2 pr-8">
          {note.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed mb-3">
          {note.description || 'No description'}
        </p>

        {/* Days Remaining */}
        <div className="mb-3 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <span className="font-semibold">
            {getDaysRemaining()} day{getDaysRemaining() !== 1 ? 's' : ''} remaining
          </span> until permanent deletion
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore(note.id);
            }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
            title="Restore note"
          >
            <FiRotateCcw size={16} />
            <span className="text-sm font-medium">Restore</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Permanently delete this note? This action cannot be undone!')) {
                onPermanentDelete(note.id);
              }
            }}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            title="Permanently delete"
          >
            <FiTrash2 size={16} />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-500">
          <span>
            Deleted: {new Date(note.deletedAt).toLocaleDateString('en-US', {
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

export default BinNoteCard;
