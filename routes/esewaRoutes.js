const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/esewa.controller');
const { authGuard } = require('../middleware/authGuard'); // Import authGuard middleware

router.post('/initiate', authGuard, initiatePayment); // Protect initiate route
router.get('/verify', authGuard, verifyPayment); // Protect verify route

module.exports = router;
