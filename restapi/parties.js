const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Activity = require('../models/Activity');
const Party = require('../models/Party');
const User_party = require('../models/User_party');

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
          //Creating the party itself
        const activity = await Activity.findOne({where: {name: req.body.activity_name}})
        const newParty = new Party({
          name: req.body.name,
          date: req.body.date,
          user_id: req.user.id,
          activity_id: activity.id,
          isagroup: false
        });
        //Creat the join table data, automatically adding 1 to the number of users
        const party = await newParty.save();
        const newUserParty = new User_party({
            user_id: req.user.id,
            party_id: party.id,
            numberofusers: 1,
            isgoing: 0,
        })
        await newUserParty.save();
        res.json(party);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  module.exports = router;