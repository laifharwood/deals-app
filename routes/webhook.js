var express = require('express');
var router = express.Router();

router.use('/', require('../middleware/webhooks/verifyRequest'), function(req, res, next){
  res.status(200).send('OK');
  next();
});

//router.use('/ordersPaid', require('../middleware/webhooks/ordersPaid'));
//router.use('/refundsCreate', require('../middleware/webhooks/refundsCreate'));
//router.use('/appUninstalled', require('../middleware/webhooks/appUninstalled'));
router.use('/productsUpdate',
  require('../middleware/webhooks/productsUpdate'),
  require('../middleware/webhooks/getShopFromDB'),
  require('../middleware/webhooks/getProductVariantPrices'),
  require('../middleware/webhooks/deactivateDeal'),
  require('../middleware/webhooks/updateQty')
);
//router.use('/shopUpdate', require('../middleware/webhooks/shopUpdate'));
//router.use('/productsDelete', require('../middleware/webhooks/productsDelete'));

module.exports = router;
