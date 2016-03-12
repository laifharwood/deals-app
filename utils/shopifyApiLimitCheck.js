module.exports = function(headers, next){
  var callLimit = headers['x-shopify-shop-api-call-limit'];
  var apiUsageString = callLimit.substring(0, callLimit.indexOf('/'));
  var apiUsage = parseInt(apiUsageString);
  if (apiUsage > 35){
    setTimeout(function(){
      next();
    }, 1000);
  }else{
    next();
  }
}
