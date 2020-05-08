const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const User = require('../models/User');
const Activity = require('../models/Activity');
const Party = require('../models/Party');

// @route   POST restapi/parties
// @desc    Create a post
// @access  Public
router.post(
    '/',
    [auth, [
        check('name', 'Text is required').not().isEmpty(),
            check('activity_name', 'Activity can not be empty').not().isEmpty(),
            check('date', 'Date can not be empty').not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const user = await User.findByPk(req.user.id);
        const activity = await Activity.findOne({where: {name: req.body.activity_name}})
        const newParty = new Party({
          name: req.body.name,
          date: req.body.date,
          user_id: req.user.id,
          activity_id: activity.id,
          isagroup: false
        });
        const party = await newParty.save();
        res.json(party);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  module.exports = router;