const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

// All note routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const notesRef = db.collection('notes');
    const snapshot = await notesRef
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const notes = [];
    snapshot.forEach(doc => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({
      status: 'success',
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    
    // Check if it's an index error
    if (error.message && error.message.includes('index')) {
      console.error('\n⚠️  FIRESTORE INDEX REQUIRED ⚠️');
      console.error('Please create the index using the URL above, or check FIRESTORE_INDEX_SETUP.md\n');
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch notes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const noteDoc = await db.collection('notes').doc(req.params.id).get();

    if (!noteDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }

    const noteData = noteDoc.data();

    // Check if the note belongs to the user
    if (noteData.userId !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      note: {
        id: noteDoc.id,
        ...noteData
      }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch note'
    });
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 */
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    try {
      const { title, description } = req.body;

      const noteData = {
        userId: req.user.uid,
        title,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const noteRef = await db.collection('notes').add(noteData);

      res.status(201).json({
        status: 'success',
        message: 'Note created successfully',
        note: {
          id: noteRef.id,
          ...noteData
        }
      });
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create note'
      });
    }
  }
);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note
 * @access  Private
 */
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    try {
      const noteRef = db.collection('notes').doc(req.params.id);
      const noteDoc = await noteRef.get();

      if (!noteDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Note not found'
        });
      }

      const noteData = noteDoc.data();

      // Check if the note belongs to the user
      if (noteData.userId !== req.user.uid) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      await noteRef.update(updateData);

      const updatedNote = await noteRef.get();

      res.status(200).json({
        status: 'success',
        message: 'Note updated successfully',
        note: {
          id: updatedNote.id,
          ...updatedNote.data()
        }
      });
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update note'
      });
    }
  }
);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const noteRef = db.collection('notes').doc(req.params.id);
    const noteDoc = await noteRef.get();

    if (!noteDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Note not found'
      });
    }

    const noteData = noteDoc.data();

    // Check if the note belongs to the user
    if (noteData.userId !== req.user.uid) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await noteRef.delete();

    res.status(200).json({
      status: 'success',
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete note'
    });
  }
});

module.exports = router;
