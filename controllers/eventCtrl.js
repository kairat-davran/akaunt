const Events = require('../models/eventModel')
const Users = require('../models/userModel')

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const eventCtrl = {
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, images, category } = req.body;

      if (!title || !date || !location) {
        return res.status(400).json({ msg: 'Required fields are missing.' });
      }

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

      res.json({ msg: 'Event created successfully.', newEvent });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      const features = new APIfeatures(Events.find({}), req.query).paginating();
      const events = await features.query.sort('-createdAt');

      res.json({ events, result: events.length });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getEvent: async (req, res) => {
    try {
      const event = await Events.findById(req.params.id);
      if (!event) return res.status(404).json({ msg: 'Event not found.' });
      res.json({ event });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { title, description, date, location, images, category } = req.body;
      const updatedEvent = await Events.findOneAndUpdate(
        { _id: req.params.id, organizer: req.user._id },
        { title, description, date, location, images, category },
        { new: true }
      );

      if (!updatedEvent) return res.status(400).json({ msg: 'Event not found or unauthorized.' });
      res.json({ msg: 'Event updated.', updatedEvent });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const event = await Events.findOneAndDelete({ _id: req.params.id, organizer: req.user._id });
      if (!event) return res.status(400).json({ msg: 'Event not found or unauthorized.' });

      // Handle GridFS deletion
      const db = req.app.locals.db;
      const gridFSBucket = req.app.locals.gridFSBucket;

      if (event.images && db && gridFSBucket) {
        for (const img of event.images) {
          if (img.filename) {
            const file = await db.collection('uploads.files').findOne({ filename: img.filename });
            if (file) {
              await gridFSBucket.delete(file._id);
            }
          }
        }
      }

      res.json({ msg: 'Event deleted.', event });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = eventCtrl;