var orientServer = require('./orientServer');

var adminDb = orientServer.use({
  name: 'DealsDB',
  username: 'root',
  password: 'Puttsalot1$123456'
});
module.exports = adminDb;
