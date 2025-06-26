const Events = require('../models/eventModel');
const Users = require('../models/userModel');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
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

const eventCtrl = {
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, images, category } = req.body;

      if (!title || !date || !location)
        return res.status(400).json({ msg: "Required fields are missing." });

      const newEvent = new Events({
        title,
        description,
        date,
        location,
        images,
        category,
        organizer: req.user._id
      });

      await newEvent.save();

      res.json({
        msg: 'Created Event!',
        newEvent: {
          ...newEvent._doc,
          organizer: req.user
        }
      });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      const features = new APIfeatures(Events.find({}), req.query).paginating();
      const events = await features.query.sort('-createdAt')
        .populate("organizer", "avatar username fullname");

      res.json({
        msg: 'Success!',
        result: events.length,
        events
      });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const event = await Events.findById(req.params.id)
        .populate("organizer", "avatar username fullname");

      if (!event)
        return res.status(404).json({ msg: 'Event not found.' });

      res.json({ event });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { title, description, date, location, images, category } = req.body;

      const event = await Events.findById(req.params.id);
      if (!event || event.organizer.toString() !== req.user._id.toString())
        return res.status(403).json({ msg: "Unauthorized or event not found." });

      // Compare image URLs to identify removed ones
      const oldUrls = event.images.map(img => img.url);
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

      const updatedEvent = await Events.findOneAndUpdate(
        { _id: req.params.id, organizer: req.user._id },
        { title, description, date, location, images, category },
        { new: true }
      ).populate("organizer", "avatar username fullname");

      res.json({ msg: "Updated Event!", updatedEvent });

    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await Events.findOneAndDelete({
        _id: req.params.id,
        organizer: req.user._id
      });

      if (!event)
        return res.status(400).json({ msg: "Event not found or unauthorized." });

      const bucket = process.env.AWS_BUCKET_NAME || 'akaunt-media';

      if (event.images && event.images.length > 0) {
        for (const image of event.images) {
          if (image.url && image.url.includes('.amazonaws.com/')) {
            const key = image.url.split('.amazonaws.com/')[1];
            if (key) {
              try {
                await s3.send(new DeleteObjectCommand({
                  Bucket: bucket,
                  Key: key
                }));
              } catch (err) {
                console.warn(`Failed to delete ${key} from S3:`, err.message);
              }
            }
          }
        }
      }

      return res.json({ msg: 'Deleted Event!', deletedEvent: event });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = eventCtrl;