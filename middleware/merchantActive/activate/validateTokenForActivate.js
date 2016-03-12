var crypto = require('crypto');
var tokenSecret = require('../../../utils/tokenSecret');

module.exports = function(req, res, next){
  var token = crypto.createHmac('sha256', tokenSecret)
  .update(req.cookies.shopDomain)
  .digest('hex')
  if (token == req.cookies.sessionToken){
    next();
  }else{
    res.status(401).send('Unauthorized');
    req.winston.log('info', {shop: req.cookies.shopDomain, message: 'Invalid Token'})
    req.adminDb.close();
  }
};
