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
      if (userType == constants.userType.customoer) {
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

exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body

    // find user by email
    const user = await User.findOne({ email });

    // check if password is correct
    if (user) {
      if (bcrypt.compare(user.password, password)) {
        // generate token
        const token = jwt.sign({ email }, jwtSecret);

        // send response to client
        const response = {
          name: user.name,
          email: user.email,
          userId: user.userId,
          userType: user.userType,
          userStatus: user.userStatus,
          token
        }
        return res.status(200).send(response)
      } else {
        return res.status(404).send({
          message: 'invalid password'
        })
      }
    } else {
      return res.status(404).send({
        message: "user doesn't exists, please sign up!"
      })
    }

  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "internal server error"
    })
  }
}