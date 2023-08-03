const { verifyToken, isAdmin, isAdminOrOwner } = require('./auth.middlewares');
const { validateTicketReqBody } = require('../middelwares/ticket.middleware');

module.exports = {
  verifyToken,
  isAdmin,
  isAdminOrOwner,
  validateTicketReqBody
}