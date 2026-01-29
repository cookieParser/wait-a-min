const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.getMe);

// Place Routes
router.get('/places', placeController.getPlaces);
router.get('/places/:id', placeController.getPlaceDetails);
router.post('/places', placeController.createPlace); // Seed/Admin
router.put('/places/:id/official', authMiddleware, placeController.updateOfficialWaitTime); // Business (Protected)

// Report Routes
router.post('/reports', reportController.submitReport);

module.exports = router;
