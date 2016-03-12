var adminDb = require('../../../utils/adminDb');
var shopifyAPI = require('shopify-node-api');
var shopifyCreds = require('../../../utils/shopifyCreds');

module.exports = function(req, res, next){
  adminDb.record.get(req.cookies.rid)
  .error(function(err){
    res.send('Could not load products. Try again later or contact support.').status(500);
    req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProductCount.js', message: err});
    req.adminDb.close();
    throw 'getShopFromDb.js error';
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
  })
};
