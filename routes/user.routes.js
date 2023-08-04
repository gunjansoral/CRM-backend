const { findAllUsers, findOneUser, updateUser } = require('../controllers/user.controller');
const { verifyToken, isAdmin, isAdminOrOwner } = require('../middelwares');

module.exports = (app) => {
  app.get('/crm/api/v1/users', verifyToken, isAdmin, findAllUsers);
  app.get('/crm/api/v1/users/:id', verifyToken, isAdmin, findOneUser);
  app.put('/crm/api/v1/users/:id', verifyToken, isAdminOrOwner, updateUser);
}