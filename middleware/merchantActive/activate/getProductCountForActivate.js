module.exports = function(req, res, next){
    req.Shopify.get('/admin/products/count.json', function(err, data, headers){
      if (err){
        res.status(500).send('Activation Failed. Please try again or contact support.');
        req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProductCountForActivate.js', message: err});
        req.adminDb.close();
        throw 'getProductCountForActivate.js';
      }else if (data){
        req.productCount = data.count;
        req.limit = 250;
        req.numberOfPages = Math.ceil(req.productCount/req.limit);
        next();
      };
    });
};
