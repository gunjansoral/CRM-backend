const { createTicket, getTickets, getTicketStatus, updateTicket } = require('../controllers/ticket.controller');
const { verifyToken, validateTicketReqBody } = require('../middelwares/index');

module.exports = (app) => {
  app.post('/crm/api/v1/tickets', verifyToken, validateTicketReqBody, createTicket);
  app.get('/crm/api/v1/tickets', verifyToken, getTickets);
  app.get('/crm/api/v1/tickets/:id', verifyToken, getTicketStatus);
  app.put('/crm/api/v1/tickets/:id', verifyToken, updateTicket);
}