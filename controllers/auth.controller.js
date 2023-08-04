const User = require('../models/user.model');
const constants = require('../utils/constants');
const { jwtSecret } = require('../configs/auth.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
  try {
    let { name, userId, email, password, userType, userStatus } = req.body;

    // status check
    if (!userStatus) {
      if (userType == constants.userType.customer) {
        userStatus = constants.userStatus.approved;
      } else {
        userStatus = constants.userStatus.pending;
      }
    }

    //create hashed password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //save user
    const user = new User({
      name,
      userId,
      email,
      password: hashedPassword,
      userType,
      userStatus
    });
    const savedUser = await user.save();

    // send response to client
    const response = {
      name: savedUser.name,
      userId: savedUser.userId,
      email: savedUser.email,
      userType: savedUser.userType,
      userStatus: savedUser.userStatus,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    }
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "internal server error"
    });
  }
}

exports.signIn = async (req, res) => {
  try {
    const { userId, password } = req.body

    // find user by userId
    const user = await User.findOne({ userId });

    // check if user doesn't exists
    if (!user) {
      return res.status(404).send({
        message: "user doesn't exists, please sign up!"
      })
    }

    // check user status
    if (user.userStatus !== constants.userStatus.approved)
      return res.status(200).send({
        message: "user with status " + user.userStatus + " is not approved"
      })

    // check password
    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) {
      return res.status(404).send({
        message: 'invalid password'
      })
    }

    // generate token
    const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '7d' });

    // send response to client
    const response = {
      name: user.name,
      email: user.email,
      userId: user.userId,
      userType: user.userType,
      userStatus: user.userStatus,
      token
    }
    return res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "internal server error"
    })
  }
}