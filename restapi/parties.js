const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Activity = require('../models/Activity');
const Party = require('../models/Party');
const User_party = require('../models/User_party');
const User = require('../models/User');

// @route   POST restapi/parties
// @desc    Create a post
// @access  Private
router.post(
    '/',
    [auth, [
        check('name', 'Party name is required').not().isEmpty(),
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

// @route   POST restapi/parties/report
// @desc    Create a report, which tells about every user how many times participated in a party with a given activity
// @access  Private
router.post(
    '/report',
    [auth, [
        check('activity_name', 'Activity is required').not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const activity = await Activity.findOne({where: {name: req.body.activity_name}});
        const parties = await Party.findAll({where: {activity_id: activity.id}});
        var selectedPartiesArray = []
        parties.forEach(partyElement => {
            selectedPartiesArray.push(partyElement.dataValues.id);
        });
        //console.log(selectedPartiesArray);
        const user_parties = await User_party.findAll( {attributes: ['user_id'], where: {party_id: selectedPartiesArray}});
        var selectedUserPartiesArray = [];
        user_parties.forEach(userPartyElement => {
            selectedUserPartiesArray.push(userPartyElement.dataValues.user_id);
        });
        //console.log(selectedUserPartiesArray);
        const users = await User.findAll();
        var reportStringArray = [];
        users.forEach(userElement => {
            var counter = 0;
            selectedUserPartiesArray.forEach(selectedUserPartyElement => {
                if(userElement.dataValues.id == selectedUserPartyElement){
                    counter++;
                }
            });
        var reportString = "name: " + userElement.dataValues.name + "with email: " + userElement.dataValues.email + " participated in parties with this activity: " + req.body.activity_name + "  " + counter + " times.";
            reportStringArray.push(reportString);
    });
        res.json(reportStringArray);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  module.exports = router;