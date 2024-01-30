const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'HelloIAmHarshShahStudentAtVITVelloreinCSECore';

router.post('/signup', [body('name', 'Enter a valid Name').isLength({ min: 3 }), body('email', 'Must be a valid email').isEmail(), body('password', 'Must be at least 5 Characters').isLength({ min: 5 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      id: user._id,
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.send({ user, authtoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Some Error Occurred');
  }
});

router.post('/login', [body('email', 'Must be a valid email').isEmail(), body('password', 'Cannot be Blank').exists()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const passwordCompare = await bcrypt.compare(user.password, password);
    if (passwordCompare) {
      return res.status(400).json({ error: 'Please try to login with the correct credentials' });
    }
    const data = {
      id: user._id,
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.send({ user, authtoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Some Error Occurred');
  }
});

module.exports = router;