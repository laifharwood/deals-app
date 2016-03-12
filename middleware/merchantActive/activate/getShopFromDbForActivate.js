var shopifyCreds = require('../../../utils/shopifyCreds');
var shopifyAPI = require('shopify-node-api');

module.exports = function(req, res, next){
  req.adminDb.record.get(req.cookies.rid)
  .error(function(err){
    res.status(500).send('Activation Failed. Please try again or contact support.');
    req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getShopFromDbForActivate', message: err});
    req.adminDb.close();
    throw 'getShopFromDbForActivate.js error';
  })
  .then(function(shop){
    req.shop = shop;
    req.Shopify = new shopifyAPI({
      shop: req.cookies.shopDomain,
      shopify_api_key: shopifyCreds.key,
      shopify_shared_secret: shopifyCreds.secret,
      access_token: req.shop.shopifyToken,
      verbose: false
    });
    next();
  });
};
