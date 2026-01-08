import React, { useState, useEffect } from 'react';
import { FiX, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteModal = ({ note, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setDescription(note.description || '');
      setCategory(note.category || 'personal');
      setIsImportant(note.isImportant || false);
    } else {
      setTitle('');
      setDescription('');
      setCategory('personal');
      setIsImportant(false);
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, category, isImportant });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="backdrop-blur-xl rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 backdrop-blur">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            {note ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-500 text-sm sm:text-base"
              placeholder="Enter note title..."
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder-gray-500 resize-none text-sm sm:text-base"
              placeholder="Write your note here..."
              rows={5}
            />
          </div>

          {/* Category and Important */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all text-sm sm:text-base"
              >
                <option value="personal">📝 Personal</option>
                <option value="work">💼 Work</option>
                <option value="ideas">💡 Ideas</option>
              </select>
            </div>

            {/* Important */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Important
              </label>
              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isImportant
                    ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-yellow-400/30'
                }`}
              >
                {isImportant ? (
                  <>
                    <FaStar className="text-lg" />
                    <span>Important</span>
                  </>
                ) : (
                  <>
                    <FiStar className="text-lg" />
                    <span>Mark Important</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium rounded-xl transition-all shadow-lg shadow-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {note ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
