module.exports = function(req, res, next){
  req.adminDb.select().from('Shop').where({myshopify_domain: req.query.shop}).one()
  .error(function (err){
    res.send('There was an error getting  your payment method status. Try again later or contact Support').status(500);
    req.winston.log('info', {shop: req.query.shop, source: 'getPaymentStatus.js', message: err});
    req.adminDb.close();
    throw 'getPaymentStatus.js error';
  })
  .then(function (shop){
      req.shopRid = '#' + shop['@rid'].cluster + ':' + shop['@rid'].position;
      res.cookie('rid', req.shopRid);
      res.cookie('shopDomain', shop.myshopify_domain)
      res.cookie('paymentMethodIsActive', shop.paymentMethodActive);
      next();
  });
}
