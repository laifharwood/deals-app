module.exports = function(req, res, next){
  req.dealOrientId = '#' + req.deal['@rid'].cluster + ':' + req.deal['@rid'].position;
  if (req.deactivateDeal){
    req.adminDb.update(req.dealOrientId)
    .set({active: false})
    .scalar()
    .then(function(total){
      req.adminDb.close();
    });
  }else{
    next();
  }
}
