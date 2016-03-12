var shopifyApiLimitCheck = require('../../utils/shopifyApiLimitCheck');
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
      if (err){
        res.redirect(req.redirUrl + '?error=\"There was an error creating the ' + topic + ' webhook.  Please try installing again or contact support.' + '\"');
        req.winston.log('info', {shop: req.shopData.myshopify_domain, source: 'createWebhook.js', webhook: topic, message: err});
        req.adminDb.close();
        throw 'createWebhook Error';
      }else{
        shopifyApiLimitCheck(req.headers, next);
      }
    });
  };
};
