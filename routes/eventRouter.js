const router = require('express').Router();
const eventCtrl = require('../controllers/eventCtrl');
const auth = require('../middleware/auth');

router.route('/events')
  .post(auth, eventCtrl.createEvent)
  .get(eventCtrl.getEvents);

router.route('/event/:id')
  .get(eventCtrl.getEvent)
  .patch(auth, eventCtrl.updateEvent)
  .delete(auth, eventCtrl.deleteEvent);

module.exports = router;