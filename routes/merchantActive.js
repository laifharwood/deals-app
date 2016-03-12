var express = require('express');
var router = express.Router();
var activateWebhook = require('../middleware/merchantActive/activate/activateWebhook');
var homePageUrl = require('../utils/homePageUrl');

router.use('/products',
  require('../middleware/merchantActive/products/validateToken'),
  require('../middleware/merchantActive/products/getShopFromDb'),
  require('../middleware/merchantActive/products/getProductCount'),
  require('../middleware/merchantActive/products/getProducts')
);
router.post('/activate',
  require('../middleware/merchantActive/activate/validateTokenForActivate'),
  require('../middleware/merchantActive/activate/createStripeToken'),
  require('../middleware/merchantActive/activate/getShopFromDbForActivate'),
  activateWebhook('orders/paid', homePageUrl + 'webhook/ordersPaid'),
  activateWebhook('refunds/create', homePageUrl + 'webhook/refundsCreate'),
  activateWebhook('products/update', homePageUrl +'webhook/productsUpdate', ['id', 'variants']),
  activateWebhook('products/create', homePageUrl + 'webhook/productsCreate'),
  activateWebhook('products/delete', homePageUrl + 'webhook/productsDelete'),
  require('../middleware/merchantActive/activate/getProductCountForActivate'),
  require('../middleware/merchantActive/activate/getProductsForActivate'),
  require('../middleware/merchantActive/activate/saveStripeToken')
);


module.exports = router;
