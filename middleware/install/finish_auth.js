var shopifyAPI = require('shopify-node-api');
var shopifyCreds = require('../../utils/shopifyCreds');
var homePageUrl = require('../../utils/homePageUrl');

module.exports = function(req, res, next){
  req.redirUrl = homePageUrl
  req.adminDb.select().from('AuthShop').where({shopName: req.query.shop}).one()
  .error(function(err){
    res.message = "";
    res.redirect(req.redirUrl + '?error=\"There was an error authorizing your shop. Try again or contact support.\"');
    req.winston.log('info', {shop: req.query.shop, source: 'finish_auth.js', message: err});
    req.adminDb.close();
    throw 'finish_auth error'
  })
  .then(function(authShop){
    var config = {
      shop: req.query.shop,
      shopify_api_key: shopifyCreds.key,
      shopify_shared_secret: shopifyCreds.secret,
      nonce: authShop.nonce
    }
    req.apiKey = shopifyCreds.key;
    var Shopify = new shopifyAPI(config);
    var query_params = req.query;
    Shopify.exchange_temporary_token(query_params, function(err, data){
      if (err){
        res.message = 'Authorization Failed';
        res.redirect(req.redirUrl + '?error=\"Authorization failed when exchanging temp token. Please try again or contact support.\"');
        req.winston.log('info', {shop: req.query.shop, source: 'finish_auth.js', message: err});
        req.adminDb.close();
        throw 'finish_auth.js error';
      }else{
        req.Shopify = new shopifyAPI({
          shop: req.query.shop,
          shopify_api_key: shopifyCreds.key,
          shopify_shared_secret: shopifyCreds.secret,
          access_token: data['access_token']
        });
        req.token = data['access_token'];
        req.successUrl = 'https://' + req.query.shop + '/admin/apps/' + shopifyCreds.key
        next();
      }
    });
  });
};
