module.exports = function(req, res, next){
  if (!req.deactivateDeal && req.updateQuantity){
    req.adminDb.update(req.dealOrientId)
    .set({qtyInStock: req.qtyInStock})
    .scalar()
    .error(function(err){
      req.winston.log('info', {shop: req.Shopify.shop, source: 'updateQty.js', message: err});
    })
    .then(function(total){
      req.adminDb.close();
    });
  }else{
    req.adminDb.close();
  }
}
