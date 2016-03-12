
module.exports = function(req, res, next){
  var productsArray = new Array();
  var apiUsage = 0;
  var requestProducts = function(x){
    req.Shopify.get('/admin/products.json?' + 'page=' + x + 'limit=' + req.limit + 'fields=id,title,variants,images,tags,updated_at,body_html', function(err, data, headers){
      if (err){
        res.status(500).send('Activation Failed. Please try again or contact support.');
        req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProductsForActivate.js', message: err});
        req.adminDb.close();
        throw 'getProducts error';
      }else if (data){
        for (var z = 0; z < data.products.length; z++){
          productsArray.push(data.products[z]);
        }
        var callLimit = headers['x-shopify-shop-api-call-limit'];
        var apiUsageString = callLimit.substring(0, callLimit.indexOf('/'));
        apiUsage = parseInt(apiUsageString);
        if (x == req.numberOfPages){
          addProductsToDb();
        }
      }
    });
  }
  var addProductsToDb = function(){
    productsArray.map(function(shopifyProduct, index){
      req.adminDb
      .let('product', function(s){
        s.create('vertex', 'Product')
        .set({
          id: shopifyProduct.id,
          title: shopifyProduct.title,
          variants: shopifyProduct.variants,
          images: shopifyProduct.images,
          tags: shopifyProduct.tags,
          body_html: shopifyProduct.body_html
        });
      })
      .let('Owns', function(s){
        s.create('edge', 'Owns')
        .from(req.cookies.rid)
        .to('$product')
      })
      .commit()
      .return('$product')
      .all()
      .error(function(err){
        if (err.message.indexOf('found duplicated key') > -1){

        }else{
          res.status(500).send('Activation Failed. Please try again or contact support.');
          req.winston.log('info', {shop: req.cookies.shopDomain, source: 'getProductsForActivate.js', message: err});
          req.adminDb.close();
          throw 'getProducts error';
        }
      })
      .then(function(results){
        if (index == productsArray.length - 1){
          next();
        }
      })
      .done()
    });
  }
  for (var x = 1; x <= req.numberOfPages;  x++){
    if (apiUsage > 35){
      setTimeout(function(){
        requestProducts(x);
      }, 1000);
    }else{
      requestProducts(x);
    }
  };
};
