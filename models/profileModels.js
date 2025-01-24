const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true,
    unique: true,
  },
  profilePic: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  additionalInfo: {
    type: Object, // Flexible key-value storage for extra user info
    default: {},
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
