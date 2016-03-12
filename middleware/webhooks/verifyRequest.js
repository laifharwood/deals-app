var shopifyCreds = require('../../utils/shopifyCreds');
var crypto = require('crypto');

module.exports = function(req, res, next){
  var signature = crypto.createHmac('sha256', shopifyCreds.secret)
  .update(req.rawBody)
  .digest('base64');
  if (signature != req.headers['x-shopify-hmac-sha256']){
    req.winston.log('info', {shop: req.headers['x-shopify-shop-domain'], source: 'verifyRequest.js', message: 'Invalid signature. Access denied'});
    req.adminDb.close();
    throw 'Invalid signature. Access denied';
  }else{
    next();
  }
}
