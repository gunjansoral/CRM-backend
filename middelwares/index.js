const { verifyToken, isAdmin, isAdminOrOwner } = require('./auth.middlewares');

module.exports = {
  verifyToken,
  isAdmin,
  isAdminOrOwner
}