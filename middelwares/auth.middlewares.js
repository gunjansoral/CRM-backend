const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configs');
const constants = require('../utils/constants');
const User = require('../models/user.model')

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) return res.status(403).send({
    message: 'token is not provided'
  })

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) return res.status(401).send({
      message: 'you are not authorised'
    })

    if (payload) {
      req.userId = payload.id
      next()
    }
  })
}

exports.isAdmin = async (req, res, next) => {
  try {
    // find user with user id
    const user = await User.findOne({ userId: req.userId })
    if (!user) {
      return res.status(401).send({
        message: 'user not found'
      })
    }

    // check if user is admin
    const userType = user.userType;
    if (userType !== constants.userType.admin) return res.status(403).send({
      message: 'Yoa are not admin'
    })

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}

exports.isAdminOrOwner = async (req, res, next) => {
  try {
    const callingUser = await User.findOne({ userId: req.userId })
    if (req.body.userType === constants.userType.admin || callingUser.userId === req.params.id) {
      if (req.body.userType !== constants.userType.admin) return res.status(403).send({
        message: `only ${constants.userType.admin}s are allowed`
      })
      next()
    } else {
      res.status(403).send({
        message: `only ${constants.userType.admin}s and ${constants.userType.customer}s are allowed`
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}