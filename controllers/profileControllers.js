const path = require('path');
const Profile = require('../models/profileModels');
const User = require('../models/userModels');

// Create or get profile after login
exports.getOrCreateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId, bio: '' });
    }
    
    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profilePic = req.files.profilePic;
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', profilePic.name);

    // Save the file
    profilePic.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'File upload failed', error: err });
      }

      const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        { profilePic: `/uploads/${profilePic.name}` },
        { new: true, upsert: true }
      );

      return res.status(200).json({ success: true, profilePic: updatedProfile.profilePic });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await Profile.findOne({ userId }).populate('userId', 'firstName lastName email');
    if (!userProfile) {
      // Create a default profile if none exists
      const newProfile = await Profile.create({ userId, bio: '' });
      const populatedProfile = await Profile.findById(newProfile._id).populate('userId', 'firstName lastName email');
      return res.status(200).json({
        success: true,
        profile: {
          ...populatedProfile._doc,
          userDetails: populatedProfile.userId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      profile: {
        ...userProfile._doc,
        userDetails: userProfile.userId,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, additionalInfo } = req.body;

    if (bio === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bio field is required' 
      });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { bio, additionalInfo },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error });
  }
};
