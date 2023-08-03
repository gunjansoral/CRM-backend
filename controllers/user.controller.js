const User = require('../models/user.model');
const { userResponse } = require('../utils/objectMassager');

exports.findAll = async (req, res) => {
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

exports.update = async (req, res) => {
  try {
    const userId = req.params.id

    // find user by user id
    const user = await User.findOne({ userId });
    if (!user) return res.status(403).send({
      message: 'user not found'
    })

    user.name = req.body.name != undefined ? req.body.name : user.name;
    user.userType = req.body.userType != undefined ? req.body.userType : user.userType;
    user.userStatus = req.body.userStatus != undefined ? req.body.userStatus : user.userStatus;

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
    res.staus(500).send({
      message: 'Internal server error'
    })
  }
}