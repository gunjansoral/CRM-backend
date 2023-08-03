const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const constants = require('../utils/constants');

exports.createTicket = async (req, res) => {
  try {
    // create ticket object from req body
    const { title, ticketPriority, description, status } = req.body;
    const reporter = req.userId;

    // find an engineer with status approved
    const { engineer } = constants.userType;
    const { approved } = constants.userStatus;
    const approvedEngineer = await User.findOne({
      userType: engineer,
      userStatus: approved
    })
    if (!approvedEngineer) return res.status(404).send({
      message: `No ${approved} engineer found`
    })

    const ticket = await Ticket.create({
      title,
      ticketPriority,
      description,
      status,
      reporter,
      assignee: approvedEngineer.userId
    })

    if (ticket) {
      const customer = await User.findOne({ userId: reporter })
      customer.ticketsCreated.push(ticket._id);
      await customer.save();

      if (approvedEngineer) {
        approvedEngineer.ticketsAssigned.push(ticket._id);
        await approvedEngineer.save();
      }
    }

    const response = {
      title: ticket.title,
      ticketPriority: ticket.ticketriority,
      description: ticket.description,
      status: ticket.status,
      reporter: ticket.reporter,
      assignee: approvedEngineer.userId
    }

    res.status(201).send(response)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error while creating ticket'
    })
  }
}