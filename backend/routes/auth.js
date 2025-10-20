const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/verify
 * @desc    Verify user token and return user info
 * @access  Private
 */
router.post('/verify', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Token is valid',
      user: req.user
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify token'
    });
  }
});

/**
 * @route   GET /api/auth/user
 * @desc    Get current user info
 * @access  Private
 */
router.get('/user', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
});

module.exports = router;
