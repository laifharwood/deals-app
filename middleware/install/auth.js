var shortid = require('shortid');
//var myCache = require('../../utils/myCache');
var shopifyAPI = require('shopify-node-api');
var shopifyCreds = require('../../utils/shopifyCreds');
var homePageUrl = require('../../utils/homePageUrl');
var adminDb = require('../../utils/adminDb');

module.exports = function(req, res){
  var nonce = shortid.generate();
  var shop = req.query.shopName + '.myshopify.com'

  adminDb.exec('UPDATE AuthShop SET shopName=:shop, nonce=:nonce UPSERT WHERE shopName=:shop', {
    params: {
      shop: shop,
      nonce: nonce
    }
  })
  .error(function(err){
    res.redirect(homePageUrl + '?error=\"There was an error authenticating your shop. Please try installing again.\"');
    req.winston.log('info', {shop: shop, source: 'auth.js', message: err});
    req.adminDb.close();
    throw 'auth.js error';
  })
  .then(function (response){
    var Shopify = new shopifyAPI({
      shop: shop,
      shopify_api_key: shopifyCreds.key,
      shopify_shared_secret: shopifyCreds.secret,
      redirect_uri: homePageUrl + 'finish_auth',
      shopify_scope: ['read_products', 'write_products', 'read_orders'],
      nonce: nonce
    });
    var auth_url = Shopify.buildAuthURL();
    req.adminDb.close();
    res.redirect(auth_url);
  })
};
