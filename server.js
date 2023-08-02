const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./configs');
const app = express();

app.use(express.json())

mongoose.connect(DB_URL).then(() => {
  console.log('db connected')
}).catch(err => console.log('error conncecting database:' + err.message));

// routes
require('./routes/auth.route')(app);

app.listen(PORT, () => {
  console.log('listening on port : ' + PORT);
});
