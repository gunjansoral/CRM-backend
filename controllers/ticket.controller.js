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

exports.getTickets = async (req, res) => {
  try {
    const { userId } = req;
    let tickets = [];

    // find user with userId
    const user = await User.findOne({ userId });
    if (user.userType === constants.userType.engineer) {
      tickets = await Ticket.find({ assignee: userId })
    }

    if (user.userType === constants.userType.customer) {
      tickets = await Ticket.find({ reporter: userId })
    }

    res.status(200).send(tickets);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id
    const { title, ticketPriority, description, status, assignee } = req.body;

    // find user by user id
    const { userId } = req;
    const user = await User.findOne({ userId });

    // approved user or approved engineer can update ticket
    if (user.userStatus !== constants.userStatus.approved) return res.status(403).send({
      message: `Only ${constants.userStatus.approved} ${user.userStatus} can update tickets`
    })

    // find ticket by ticket id 
    const ticket = await Ticket.findOne({ _id: ticketId });
    if (!ticket) return res.status(403).send({
      message: 'Ticket not found'
    })

    // user and admin roles -> everything
    if (user.userType === constants.userType.customer || user.userType === constants.userType.admin) {
      ticket.title = title != undefined ? title : ticket.title;
      ticket.ticketPriority = ticketPriority != undefined ? ticketPriority : ticket.ticketPriority;
      ticket.description = description != undefined ? description : ticket.description;
      ticket.status = status != undefined ? status : ticket.status;
    }

    // engineer roles -> ticket priority and status
    if (user.userType === constants.userType.engineer) {
      ticket.status = status != undefined ? status : ticket.status;
    }

    if (user.userType === constants.userType.admin) {
      ticket.assignee = assignee != undefined ? assignee : ticket.assignee;
    }

    const updatedTicket = await ticket.save();
    res.status(200).send({
      title: updatedTicket.title,
      description: updatedTicket.description,
      ticketPriority: updatedTicket.ticketPriority,
      status: updatedTicket.status,
      assignee: updatedTicket.assignee,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Internal server error'
    })
  }
}