// controllers/uploadCtrl.js
const User = require('../models/userModel')

const uploadCtrl = {
  // 📸 General image upload (returns S3 URL)
  uploadImage: async (req, res) => {
    try {
      if (!req.file || !req.file.location) {
        return res.status(400).json({ msg: 'Upload failed: No file or file.location' });
      }

      res.send(req.file.location); // Return S3 public URL
    } catch (err) {
      console.error('Upload Error:', err.message);
      res.status(500).json({ msg: err.message });
    }
  },

  // 👤 Upload logo & update user profile
  uploadLogo: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      user.seller.logo = req.file.location;
      await user.save();
      res.send(req.file.location);
    } catch (err) {
      console.error('Upload Logo Error:', err.message);
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = uploadCtrl;