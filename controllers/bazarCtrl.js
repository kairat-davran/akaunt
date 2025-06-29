const Bazar = require('../models/bazarModel');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const bazarCtrl = {
  createItem: async (req, res) => {
    try {
      const { title, description, price, location, images, category } = req.body;
      if (!title || !price || !location)
        return res.status(400).json({ msg: 'Required fields are missing.' });

      const newItem = new Bazar({
        title,
        description,
        price,
        location,
        images,
        category,
        seller: req.user._id,
      });

      await newItem.save();

      res.json({
        msg: 'Created Item!',
        newItem: { ...newItem._doc, seller: req.user },
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getItems: async (req, res) => {
    try {
      const features = new APIfeatures(Bazar.find({}), req.query).paginating();
      const items = await features.query.sort('-createdAt')
        .populate('seller', 'avatar username fullname');

      res.json({ msg: 'Success!', result: items.length, items });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      const { title, description, price, location, images, category } = req.body;
      const item = await Bazar.findById(req.params.id);

      if (!item || item.seller.toString() !== req.user._id.toString())
        return res.status(403).json({ msg: 'Unauthorized or item not found.' });

      const oldUrls = item.images.map(img => img.url);
      const newUrls = images.map(img => img.url);
      const removedUrls = oldUrls.filter(url => !newUrls.includes(url));

      const bucket = process.env.AWS_BUCKET_NAME || 'akaunt-media';
      for (const url of removedUrls) {
        if (url && url.includes('.amazonaws.com/')) {
          const key = url.split('.amazonaws.com/')[1];
          if (key) {
            try {
              await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
            } catch (err) {
              console.warn(`Failed to delete ${key} from S3:`, err.message);
            }
          }
        }
      }

      const updatedItem = await Bazar.findOneAndUpdate(
        { _id: req.params.id, seller: req.user._id },
        { title, description, price, location, images, category },
        { new: true }
      ).populate('seller', 'avatar username fullname');

      res.json({ msg: 'Updated Item!', updatedItem });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const item = await Bazar.findOneAndDelete({
        _id: req.params.id,
        seller: req.user._id,
      });

      if (!item)
        return res.status(400).json({ msg: 'Item not found or unauthorized.' });

      const bucket = process.env.AWS_BUCKET_NAME || 'akaunt-media';

      if (item.images && item.images.length > 0) {
        for (const image of item.images) {
          if (image.url && image.url.includes('.amazonaws.com/')) {
            const key = image.url.split('.amazonaws.com/')[1];
            if (key) {
              try {
                await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
              } catch (err) {
                console.warn(`Failed to delete ${key} from S3:`, err.message);
              }
            }
          }
        }
      }

      return res.json({ msg: 'Deleted Item!', deletedItem: item });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = bazarCtrl;