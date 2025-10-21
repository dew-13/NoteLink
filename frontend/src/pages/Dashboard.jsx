import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import NoteView from '../components/NoteView';
import BinNoteCard from '../components/BinNoteCard';
import Sidebar from '../components/Sidebar';
import { getNotes, createNote, updateNote, deleteNote, getBinNotes, restoreNote, permanentlyDeleteNote, archiveNote } from '../services/noteService';

const Dashboard = () => {
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
    <div className="flex min-h-screen">
      <div className="fixed left-0 top-16 bottom-0 z-40">
        <Sidebar 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          notesCount={notesCount}
        />
      </div>
      
      <div className="flex-1 ml-20 px-8 py-8 bg-[#1f1c28] min-h-screen">
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
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2">
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
                    <p className="text-gray-400 text-sm">
                      {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
                      {activeCategory === 'bin' && filteredNotes.length > 0 && (
                        <span className="ml-2 text-red-400">• Notes will be permanently deleted after 30 days</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* View Toggle */}
                    <div className="flex items-center bg-[#262a4a]/50 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'grid'
                            ? 'bg-[#3B82F6] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        title="Grid View"
                      >
                        <FiGrid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'list'
                            ? 'bg-[#3B82F6] text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        title="List View"
                      >
                        <FiList size={20} />
                      </button>
                    </div>
                    {activeCategory !== 'bin' && (
                      <button
                        onClick={handleCreateNote}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <FiPlus />
                        <span>New Note</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="relative max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-11"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-[#262a4a]/50 to-[#1e2139]/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/30">
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
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-4'
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
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-4'
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
    </div>
  );
};

export default Dashboard;
