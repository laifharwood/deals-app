var stripeCreds = require('../../../utils/stripeCreds')
var stripe = require("stripe")(stripeCreds.secret);

module.exports = function(req, res, next){
  var stripeToken = req.query.id;
  stripe.customers.create({
    source: stripeToken,
    description: req.cookies.shopDomain
  }, function(err, customer){
    if(err){
      res.status(500).send('Activation Failed. Try activating again or contact support.');
      req.winston.log('info', {shop: req.cookies.shopDomain, source: 'createStripeToken.js', webhook: topic, message: err});
      req.adminDb.close();
      throw 'createStripeToken.js error';
    }else{
      req.stripeCustomerId = customer.id
      next();
    }
  })
};
