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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-[#262a4a]/95 to-[#1e2139]/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full border border-gray-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-100">
            {note ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1d35]/60 border border-gray-700/50 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
              placeholder="Enter note title..."
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1d35]/60 border border-gray-700/50 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500 resize-none"
              placeholder="Write your note here..."
              rows={5}
            />
          </div>

          {/* Category and Important */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1d35]/60 border border-gray-700/50 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="personal">📝 Personal</option>
                <option value="work">💼 Work</option>
                <option value="ideas">💡 Ideas</option>
              </select>
            </div>

            {/* Important */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Important
              </label>
              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`w-full px-4 py-3 rounded-xl border transition-all flex items-center justify-center space-x-2 ${
                  isImportant
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                    : 'bg-[#1a1d35]/60 border-gray-700/50 text-gray-400 hover:border-yellow-500/30'
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
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
