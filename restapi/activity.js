const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Activity = require('../models/Activity');

// @route   GET restapi/activity
// @desc    Get all activity
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
      const activity = await Activity.findAll();
      res.json({activity});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// @route   POST restapi/activity
// @desc    Create an activity
// @access  Private
router.post(
    '/',
    [auth, [
        check('name', 'Activity name is required').not().isEmpty(),
            check('description', 'Description can not be empty').not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
          //Check if it is not exists already
          let activity = await Activity.findOne({where: { name: req.body.name } });

          if (activity) {
            return res
              .status(400)
              .json({ errors: [{ msg: 'Activity already exists.' }] });
          }
          //Creating the activity
        activity = new Activity({
          name: req.body.name,
          description: req.body.description,
        });
        await activity.save();
        res.json(activity);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

  module.exports = router;