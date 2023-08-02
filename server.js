const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL } = require('./configs');
const app = express();

mongoose.connect(DB_URL);

const db = mongoose.connection;


db.on('error', err => {
  console.log(err);
});

db.once('connected', () => {
  console.log('db connected');
});

app.listen(PORT, () => {
  console.log('listening on port : ' + PORT);
});
