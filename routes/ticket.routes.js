const { createTicket } = require('../controllers/ticket.controller');
const { verifyToken, validateTicketReqBody } = require('../middelwares/index');

module.exports = (app) => {
  app.post('/crm/api/v1/tickets', verifyToken, validateTicketReqBody, createTicket)
}