module.exports = function(req, res, next){
  req.adminDb.update('Shop').set({stripeCustomerId: req.stripeCustomerId, paymentMethodActive: true}).where({'@rid': req.cookies.rid}).scalar()
  .error(function(err){
    res.status(500).send('Activation Failed. Please try again or contact support');
    req.winston.log('info', {shop: req.cookies.shopDomain, source: 'saveStripeToken.js', message: err});
    req.adminDb.close();
    throw 'saveStripeToken.js error';
  })
  .then(function(total){
    req.adminDb.close();
    res.status(200).send('Success!');
  });
};
