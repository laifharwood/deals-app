module.exports = function(req, res, next){
  req.adminDb.select().from('Shop').where({domain: req.headers['x-shopify-shop-domain']}).one()
  .then(function(shop){
    if (shop){
      req.shop = shop;
      next();
    }else{
      req.adminDb.close();
    }
  })
}
