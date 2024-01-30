const jwt = require('jsonwebtoken');

const JWT_SECRET = 'HelloIAmHarshShahStudentAtVITVelloreinCSECore';

const fetchUser = (req, res, next) => {
  const authtoken = req.header('auth-token');
  if (!authtoken) {
    res.status(401).send({ error: 'Please Authenticate with valid token' });
  }
  const data = jwt.verify(authtoken, JWT_SECRET);
  req.user = data;
  next();
};

module.exports = fetchUser;
