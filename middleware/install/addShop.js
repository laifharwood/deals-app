module.exports = function(req, res){
  req.adminDb.exec('UPDATE Shop SET id=:id, plan_name=:plan_name, myshopify_domain=:myshopify_domain, isInstalled=:isInstalled, paymentMethodActive=:paymentMethodActive, province_code=:province_code, name=:name, email=:email, shopifyToken=:shopifyToken, domain=:domain, province=:province, country=:country, zip=:zip, city=:city, phone=:phone, country_code=:country_code, country_name=:country_name, currency=:currency, money_with_currency_format=:money_with_currency_format, shop_owner=:shop_owner, timezone=:timezone UPSERT WHERE myshopify_domain=:myshopify_domain', {
    params: {
      id: req.shopData.id,
      name: req.shopData.name,
      shopifyToken: req.token,
      email: req.shopData.email,
      domain: req.shopData.domain,
      province: req.shopData.province,
      country: req.shopData.country,
      zip: req.shopData.zip,
      city: req.shopData.city,
      phone: req.shopData.phone,
      country_code: req.shopData.country_code,
      country_name: req.shopData.country_name,
      currency: req.shopData.currency,
      money_with_currency_format: req.shopData.money_with_currency_format,
      timezone: req.shopData.timezone,
      shop_owner: req.shopData.shop_owner,
      province_code: req.shopData.province_code,
      plan_name: req.shopData.plan_name,
      myshopify_domain: req.shopData.myshopify_domain,
      isInstalled: true,
      paymentMethodActive: false
    }
  })
  .error(function(err){
    res.redirect(req.redirUrl + "?error=\"There was an error saving your shop info to our database, please try installing again or contact support\".");
    req.winston.log('info', {shop: req.shopDate.myshopify_domain, source: 'addShop.js', message: err});
    req.adminDb.close();
    throw 'addShop.js error';
  })
  .then(function(shop){
    //Shop added successfully
    adminDb.close();
    res.redirect(req.successUrl);
  });
};
