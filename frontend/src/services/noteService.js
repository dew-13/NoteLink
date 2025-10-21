import api from './api';

// Get all notes
export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

// Get a single note
export const getNote = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

// Create a new note
export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

// Update a note
export const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

// Delete a note (soft delete - move to bin)
export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

// Get all deleted notes (bin)
export const getBinNotes = async () => {
  const response = await api.get('/notes/bin/all');
  return response.data;
};

// Archive a note
export const archiveNote = async (id) => {
  const response = await api.post(`/notes/${id}/archive`);
  return response.data;
};

// Restore a note from bin
export const restoreNote = async (id) => {
  const response = await api.post(`/notes/${id}/restore`);
  return response.data;
};

// Permanently delete a note
export const permanentlyDeleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}/permanent`);
  return response.data;
};
