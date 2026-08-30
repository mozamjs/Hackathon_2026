const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'awamdesk-complaints',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(null, true);
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
    }

    cb(null, true);
  },
});

const complaintImageUpload = upload.single('image');

module.exports = { complaintImageUpload };
