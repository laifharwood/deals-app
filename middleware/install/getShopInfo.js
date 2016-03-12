module.exports = function(req, res, next){
  req.Shopify.get('/admin/shop.json', function(err, data, headers){
    if (err){
      res.redirect(req.redirUrl + '?error=\"There was an error getting yoru shop data. Please try installing again or contact support.\"');
      req.winston.log('info', {shop: req.query.shop, source: 'getShopInfo.js', message: err});
      req.adminDb.close();
      throw 'getShopInfo.js error';
    }else{
      req.shopData = data.shop;
      next();
    }
  });
};
