const express = require('express');
const router = express.Router();

const Activity = require('../models/Activity');

// @route   POST restapi/initialize
// @desc    Create a post
// @access  Public
router.post(
    '/',
    async (req, res) => {
      try {
        const newActivity = new Activity({
          name: "Running",
          description: "It is an ability to move quickly",
        });
        await newActivity.save();
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );

  module.exports = router;