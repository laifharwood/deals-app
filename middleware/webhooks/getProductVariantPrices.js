var shopifyAPI = require('shopify-node-api');
var shopifyCreds = require('../../utils/shopifyCreds');

module.exports = function(req, res, next){
  req.Shopify = new shopifyAPI({
    shop: req.headers['x-shopify-shop-domain'],
    shopify_api_key: shopifyCreds.key,
    shopify_shared_secret: shopifyCreds.secret,
    access_token: req.shop.shopifyToken,
    verbose: false
  });
  req.Shopify.get('/admin/products/' + req.productId + '/variants.json?fields=price,inventory_management,inventory_policy,inventory_quantity', function(err, data, headers){
    if(err){
      req.winston.log('info', {shop: req.Shopify.shop, source: 'getProductVarianPrices.js', message: err});
      req.adminDb.close();
    }else if (data){
      req.deactivateDeal = false;
      req.updateQuantity = false;
      for (var i = 0; i < data.variants.length; i++){
        if (data.variants[i].price > req.deal.dealPriceHigh){
          req.deactivateDeal = true;
          break;
        }
      }
      if (req.deactivateDeal == false){
        req.qtyInStock = 0
        var numberOfContinue = 0
        for (var i = 0; i < data.variants.length; i++){
          if (data.variants[i].inventory_management == 'shopify'){
              req.qtyInStock += data.variants[i].inventory_quantity
              if (data.variants[i].inventory_policy == 'continue'){
                ++numberOfContinue
              }
          }else{
            ++numberOfContinue
          }
        }
        if (req.qtyInStock != req.deal.qtyInStock){
          req.updateQuantity = true;
        }
        if (numberOfContinue < 1 && req.qtyInStock < 1){
          req.deactivateDeal = true;
        }
      }
      if (req.deactivateDeal || req.updateQuantity){
        next();
      }else{
        req.adminDb.close();
      }
    }
  });
}
