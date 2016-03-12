var homePageUrl = require('../../../utils/homePageUrl');
var shopifyApiLimitCheck = require('../../../utils/shopifyApiLimitCheck');

module.exports = function(topic, address, fields){
  return function(req, res, next){
    var postData = {
      'webhook': {
        'topic': topic,
        'address': address,
        'format': 'json',
        'fields': fields
      }
    };
    req.Shopify.post('/admin/webhooks.json', postData, function(err, data, headers){
      var failureFunc = function(){
        res.status(500).send('Activation Failed. Try activating again or contact support.');
        req.winston.log('info', {shop: req.cookies.shopDomain, source: 'activateWebhook.js', webhook: topic, message: err});
        req.adminDb.close();
        throw 'activateWebhook.js error'
      }
      if (err){
        var alreadyExists = false;
        if(err.error.address){
          err.error.address.map(function(prop){
            if (prop == 'for this topic has already been taken'){
              alreadyExists = true;
            }
          });
          if (alreadyExists){
            shopifyApiLimitCheck(headers, next);
          }else{
            failureFunc();
          }
        }else{
          failureFunc();
        }
      }else{
        shopifyApiLimitCheck(headers, next);
      }
    });
  };
};
