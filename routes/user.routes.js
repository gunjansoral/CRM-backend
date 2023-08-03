const { findAll, update } = require('../controllers/user.controller');
const { verifyToken, isAdmin, isAdminOrOwner } = require('../middelwares');

module.exports = (app) => {
  app.get('/crm/api/v1/users', verifyToken, isAdmin, findAll);
  app.put('/crm/api/v1/users/:id', verifyToken, isAdminOrOwner, update);
}