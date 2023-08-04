const User = require('../models/user.model');
const constants = require('../utils/constants');
const { userResponse } = require('../utils/objectMassager');

exports.findAllUsers = async (req, res) => {
  try {
    const queryObj = {};
    const userStatus = req.query.userStatus;
    const userType = req.query.userType;
    if (userStatus) {
      queryObj.userStatus = userStatus;
    }
    if (userType) {
      queryObj.userType = userType;
    }
    // find users
    const users = await User.find(queryObj);

    // check if users exists
    if (!users) return res.status(404).send({
      message: 'Users not found'
    })

    // send user to client
    res.status(200).send(userResponse(users));
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}

exports.findOneUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // find user by userId
    const user = await User.findOne({ userId })
    if (!user) return res.status(403).send({
      message: 'No user exists with id:' + userId
    })

    // send user to client
    const response = {
      name: user.name,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
      ticketsCreated: user.ticketsCreated,
      ticketsAssigned: user.ticketsAssigned
    }
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id
    const { name, userType, userStatus } = req.body;
    // find user by user id
    const user = await User.findOne({ userId });
    if (!user) return res.status(403).send({
      message: 'user not found'
    })

    user.name = name != undefined ? name : user.name;
    user.userType = userType != undefined ? userType : user.userType;
    user.userStatus = userStatus != undefined ? userStatus : user.userStatus;

    const updatedUser = await user.save();
    res.status(200).send({
      name: updatedUser.name,
      userId: updatedUser.userId,
      email: updatedUser.email,
      userType: updatedUser.userType,
      userStatus: updatedUser.userStatus,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}