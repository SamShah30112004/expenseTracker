const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/User');
const Group = require('../models/Group');
const router = express.Router();

router.post('/addfriend', fetchUser, [body('email').isEmail().withMessage('Invalid email format')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const friendEmail = req.body.email;

  try {
    const friend = await User.findOne({ email: friendEmail });
    const user = await User.findById(userId);

    if (!friend) {
      return res.status(400).json({ error: 'Friend not found with the provided email.' });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ error: "Friend is already in the user's friends list." });
    }

    if (friend.friends.includes(userId)) {
      return res.status(400).json({ error: "User is already in the friend's friends list." });
    }

    await User.findByIdAndUpdate(userId, { $push: { friends: friend._id } }, { new: true });

    await User.findByIdAndUpdate(friend._id, { $push: { friends: userId } }, { new: true });

    res.status(200).json({ message: 'Friend added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/creategroup', fetchUser, [body('groupName').notEmpty().withMessage('Group name is required'), body('members').isArray({ min: 1 }).withMessage('At least one member is required')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { groupName, members } = req.body;
  const updatedMembers = [...members, userId];

  try {
    const user = await User.findById(userId);
    const group = new Group({
      name: groupName,
      members: updatedMembers,
    });

    const savedGroup = await group.save();

    await User.findByIdAndUpdate(userId, { $push: { groups: savedGroup._id } });

    await User.updateMany({ _id: { $in: members } }, { $push: { groups: savedGroup._id } });

    res.status(200).json({ message: 'Group created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
