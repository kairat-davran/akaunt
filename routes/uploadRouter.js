const router = require('express').Router();
const dotenv = require('dotenv');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const auth = require('../middleware/auth');
const uploadCtrl = require('../controllers/uploadCtrl.js');

dotenv.config();

// AWS S3 config
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Image validation
const imageFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image files allowed!'), false);
  } else {
    cb(null, true);
  }
};

// Multer config with S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME || 'akaunt-media',
    key(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Routes
router.route('/upload')
  .post(auth, upload.single('image'), uploadCtrl.uploadImage);

router.route('/upload/logo')
  .post(auth, upload.single('image'), uploadCtrl.uploadLogo);

module.exports = router;