const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan'); //Middleware that logs requests
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup 
mongoose.connect('mongodb://localhost/auth');
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log('Mongoose Connected');
});

// App Setup
// app.use() registers the argument as middleware
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on port: ${port}`);

