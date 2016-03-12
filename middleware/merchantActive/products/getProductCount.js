module.exports = function(req, res, next){
  if (req.query.page == 1){
    req.Shopify.get('/admin/products/count.json', function(err, data, headers){
      if (err){
        res.send('There was an error getting your products').status(500);
        req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProductCount.js', message: err});
        req.adminDb.close();
        throw 'getProductCount.js';
      }else if (data){
        req.productCount = data.count;
        req.limit = 30;
        req.numberOfPages = Math.ceil(req.productCount/req.limit);
        next();
      };
    });
  }else{
    next();
  };
};
