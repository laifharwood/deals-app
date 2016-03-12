var shopifyCreds = require('../../utils/shopifyCreds');
var homePageUrl = require('../../utils/homePageUrl');
var shopifyAPI = require('shopify-node-api');

module.exports = function(req, res, next){
  var Shopify = new shopifyAPI({
    shop: req.query.shop,
    shopify_api_key: shopifyCreds.key,
    shopify_shared_secret: shopifyCreds.secret
  });

  if (Shopify.is_valid_signature(req.query, true)){
    next();
  }else{
    req.adminDb.close();
    res.redirect(homePageUrl);
  }
};
