const express = require('express');
const { uploadProfilePic, getUserInfo, updateProfile, getOrCreateProfile } = require('../controllers/profileControllers');
const { authGuard } = require('../middleware/authGuard');
const router = express.Router();

router.get('/login-profile', authGuard, getOrCreateProfile);
router.post('/uploadProfilePic', authGuard, uploadProfilePic);
router.get('/info', authGuard, getUserInfo);
router.put('/update', authGuard, updateProfile);

module.exports = router;
