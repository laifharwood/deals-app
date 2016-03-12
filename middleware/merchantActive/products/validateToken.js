var crypto = require('crypto');
var tokenSecret = require('../../../utils/tokenSecret');

module.exports = function(req, res, next){
  var token = crypto.createHmac('sha256', tokenSecret)
  .update(req.cookies.shopDomain)
  .digest('hex')
  if (token == req.cookies.sessionToken){
    next();
  }else{
    req.adminDb.close();
    res.send('Unauthorized. Make sure you have cookies turned on and try again.').status(401);
  }
};
