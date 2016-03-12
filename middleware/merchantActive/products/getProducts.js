module.exports = function(req, res, next){
  req.Shopify.get('/admin/products.json?' + 'page=' + req.query.page + 'limit=' + req.limit + 'fields=id,title,variants', function(err, data, headers){
    if (err){
      res.send('There was an error getting your products').status(500);
      req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProducts', message: err});
      req.adminDb.close();
      throw 'getProducts error';
    }else if (data){
      var productArray = [];
      data.products.map(function(product){
        var productObject = {title: product.title, id: product.id};
        var priceLow;
        var priceHigh;
        product.variants.map(function(variant){
            if (priceLow === undefined && priceHigh === undefined){
              priceLow = variant.price;
              priceHigh = variant.price;
            }else if (priceLow > variant.price){
              priceLow = variant.price;
            }else if (priceHigh < variant.price){
              priceHigh = variant.price;
            };
            productObject['priceLow'] = priceLow;
            productObject['priceHigh'] = priceHigh;
        });
        productArray.push(productObject)
      });
      req.productResponseObject = {productCount: req.productCount, numberOfPages: req.numberOfPages};
      var key = 'page' + req.query.page;
      req.productResponseObject[key] = productArray;
      res.json(req.productResponseObject);
    }
  });
};
