var OrientDB = require('orientjs');

var orientServer = OrientDB({
  host: process.env.PRIVATEIP || '198.199.106.238',
  port: 2424,
  username: 'root',
  password: 'Puttsalot1$123456'
});

module.exports = orientServer;
