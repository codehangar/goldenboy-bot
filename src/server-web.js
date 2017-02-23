const express = require('express');

const app = express();

/** Static Files */
app.use('/', express.static(__dirname + '/web'));

const port = process.env.PORT || 8000;
const server = app.listen(port, function() {
  console.log('listening on port: %s', port);
});

module.exports = server;
