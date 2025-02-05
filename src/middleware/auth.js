const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch(error) {
    res.status(401).send('Unauthorized');
  }
}

module.exports = auth;