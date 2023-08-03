const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./configs');
const app = express();

app.use(express.json())

// database connection
mongoose.connect(DB_URL)
const db = mongoose.connection;
db.on('error', err => {
  console.log(err)
})

db.once('open', () => [
  console.log('db connected')
])

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(PORT, () => {
  console.log('listening on port : ' + PORT);
});
