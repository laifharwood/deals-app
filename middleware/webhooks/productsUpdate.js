
module.exports = function(req, res, next){
  //console.log('Headers: ', req.headers);
  //console.log('Query: ', req.query);
  //console.log('Params: ', req.params);
  //console.log('Body: ', req.rawBody);
  // req.productId = req.headers['x-shopify-product-id'];
  // req.adminDb.select().from('Deal').where({productId: req.productId, active: true}).one()
  // .then(function (deal){
  //   if (deal) {
  //     //console.log('Deal: ', deal);
  //     req.deal = deal;
  //     next();
  //   }else{
  //     req.adminDb.close();
  //   }
  // });
}
