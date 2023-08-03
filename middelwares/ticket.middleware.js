exports.validateTicketReqBody = (req, res, next) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).send({
    message: "Title of the ticket is missing"
  });

  if (!description) return res.status(400).send({
    messasge: "Description of the ticket is missing"
  });

  next();
}