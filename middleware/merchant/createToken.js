var crypto = require('crypto');
var tokenSecret = require('../../utils/tokenSecret');

module.exports = function(req, res, next){
  var token = crypto.createHmac('sha256', tokenSecret)
  .update(req.query.shop)
  .digest('hex')
  res.cookie('sessionToken', token, {httpOnly: true, secure: true});
  next();
};
