exports.userResponse = (users) => {
  let userResponse = [];

  users.forEach(user => {
    const { name, userId, email, userType, userStatus } = user;
    userResponse.push({
      name, userId, email, userType, userStatus
    })
  });

  return userResponse;
}