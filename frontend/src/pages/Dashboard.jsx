import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import NoteView from '../components/NoteView';
import BinNoteCard from '../components/BinNoteCard';
import Sidebar from '../components/Sidebar';
import { getNotes, createNote, updateNote, deleteNote, getBinNotes, restoreNote, permanentlyDeleteNote, archiveNote } from '../services/noteService';

const Dashboard = ({ sidebarOpen = false, onCloseSidebar = () => {} }) => {
  const [notes, setNotes] = useState([]);
  const [binNotes, setBinNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchBinNotes();
  }, []);

  useEffect(() => {
    if (activeCategory === 'bin') {
      // Filter bin notes
      let filtered = binNotes;
      if (searchQuery) {
        filtered = filtered.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setFilteredNotes(filtered);
    } else {
      // Filter regular notes
      let filtered = notes;

      // Filter by category
      if (activeCategory === 'important') {
        // Show all important notes regardless of category
        filtered = filtered.filter((note) => note.isImportant === true);
      } else if (activeCategory !== 'all') {
        filtered = filtered.filter((note) => note.category === activeCategory);
      }

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes, binNotes, activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNotes();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.details || 'Failed to load notes. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBinNotes = async () => {
    try {
      const data = await getBinNotes();
      setBinNotes(data.notes || []);
    } catch (error) {
      console.error('Error fetching bin notes:', error);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setViewingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setViewingNote(null);
    setIsModalOpen(true);
  };

  const handleViewNote = (note) => {
    setViewingNote(note);
  };

  const handleCloseView = () => {
    setViewingNote(null);
  };

  const handleSaveNote = async (noteData) => {
    try {
      setError('');
      if (selectedNote) {
        // Update existing note
        await updateNote(selectedNote.id, noteData);
      } else {
        // Create new note
        await createNote(noteData);
      }
      await fetchNotes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Move this note to bin?')) {
      try {
        setError('');
        await deleteNote(id);
        await fetchNotes();
        await fetchBinNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  const handleRestoreNote = async (id) => {
    try {
      setError('');
      await restoreNote(id);
      await fetchNotes();
      await fetchBinNotes();
    } catch (error) {
      console.error('Error restoring note:', error);
      setError('Failed to restore note. Please try again.');
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      setError('');
      await permanentlyDeleteNote(id);
      await fetchBinNotes();
    } catch (error) {
      console.error('Error permanently deleting note:', error);
      setError('Failed to permanently delete note. Please try again.');
    }
  };

  const handleArchiveNote = async (id) => {
    try {
      setError('');
      await archiveNote(id);
      await fetchNotes();
    } catch (error) {
      console.error('Error archiving note:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to archive note. Please try again.';
      setError(errorMsg);
    }
  };

  // Calculate notes count by category
  const notesCount = {
    all: notes.length,
    personal: notes.filter(n => n.category === 'personal').length,
    work: notes.filter(n => n.category === 'work').length,
    ideas: notes.filter(n => n.category === 'ideas').length,
    important: notes.filter(n => n.isImportant === true).length,
    archived: notes.filter(n => n.category === 'archived').length,
    bin: binNotes.length,
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        notesCount={notesCount}
        isOpen={sidebarOpen}
        onClose={onCloseSidebar}
      />
      
      <div className="flex-1 px-3 sm:px-4 md:px-8 py-6 md:py-8 bg-black min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {viewingNote ? (
            <NoteView 
              note={viewingNote}
              onClose={handleCloseView}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onArchive={handleArchiveNote}
            />
          ) : (
            <>
              {/* Stats Dashboard */}
              <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800 backdrop-blur-sm">
                <div className="flex items-center justify-around gap-2 sm:gap-4 md:gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
                      <p className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400">
                        {notes.filter(n => n.category === 'personal').length}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Personal</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
                      <p className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400">
                        {notes.filter(n => n.category === 'work').length}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Work</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
                      <p className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400">
                        {notes.filter(n => n.category === 'ideas').length}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Ideas</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
                      <p className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400">
                        {notes.filter(n => n.isImportant).length}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Important</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 md:mb-8">
                <div className="flex flex-col gap-4 mb-4 md:mb-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-gray-100 mb-1 md:mb-2 truncate">
                        {activeCategory === 'all' 
                          ? 'All Notes' 
                          : activeCategory === 'personal'
                          ? '📝 Personal'
                          : activeCategory === 'work'
                          ? '💼 Work'
                          : activeCategory === 'ideas'
                          ? '💡 Ideas'
                          : activeCategory === 'important'
                          ? '⭐ Important'
                          : activeCategory === 'archived'
                          ? '📦 Archived'
                          : activeCategory === 'bin'
                          ? '🗑️ Bin'
                          : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                      </h1>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                        {activeCategory === 'bin' && filteredNotes.length > 0 && (
                          <span className="ml-2 text-gray-400 block sm:inline">• Deleted after 30 days</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Search Icon */}
                      <button
                        onClick={() => setIsSearchOpen(true)}
                        className="h-6 w-6 rounded-md transition-all flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800"
                        title="Search notes"
                      >
                        <FiSearch size={16} />
                      </button>
                      {/* View Toggle */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`h-6 w-6 rounded-md transition-all flex items-center justify-center ${
                            viewMode === 'grid'
                              ? 'bg-yellow-400 text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title="Grid View"
                        >
                          <FiGrid size={14} />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`h-6 w-6 rounded-md transition-all flex items-center justify-center ${
                            viewMode === 'list'
                              ? 'bg-yellow-400 text-black'
                              : 'text-gray-400 hover:text-white'
                          }`}
                          title="List View"
                        >
                          <FiList size={14} />
                        </button>
                      </div>
                      {activeCategory !== 'bin' && (
                        <button
                          onClick={handleCreateNote}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg flex items-center justify-center h-6 w-6 shrink-0 transition-all"
                          title="New Note"
                        >
                          <FiPlus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-gray-800 border border-gray-700 text-gray-200 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="backdrop-blur-sm rounded-2xl p-12">
                    <p className="text-gray-400 text-lg">
                      {searchQuery
                        ? 'No notes found matching your search.'
                        : activeCategory === 'bin'
                        ? 'Bin is empty.'
                        : activeCategory !== 'all'
                        ? `No notes in ${activeCategory} category yet.`
                        : 'No notes yet. Create your first note!'}
                    </p>
                  </div>
                </div>
              ) : activeCategory === 'bin' ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                    : 'flex flex-col gap-3 sm:gap-4'
                }>
                  {filteredNotes.map((note) => (
                    <BinNoteCard
                      key={note.id}
                      note={note}
                      onRestore={handleRestoreNote}
                      onPermanentDelete={handlePermanentDelete}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                    : 'flex flex-col gap-3 sm:gap-4'
                }>
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onView={handleViewNote}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteNote}
                      onArchive={handleArchiveNote}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <NoteModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
      />

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 z-50 pt-20">
          <div className="w-full sm:max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500 text-lg sm:text-xl" />
              </div>
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsSearchOpen(false);
                }}
                className="w-full pl-12 sm:pl-14 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-base placeholder-gray-500"
                autoFocus
              />
            </div>
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-40"
            aria-label="Close search"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
