var express = require('express');
var router = express.Router();
var createWebhook = require('../middleware/install/createWebhook');
var homePageUrl = require('../utils/homePageUrl');
var path = require('path');

router.use('/auth', require('../middleware/install/auth'));
router.use('/finish_auth',
  require('../middleware/install/finish_auth'),
  require('../middleware/install/getShopInfo'),
  createWebhook('app/uninstalled', homePageUrl + 'webhook/appUninstalled'),
  createWebhook('shop/update', homePageUrl + 'webhook/shopUpdate'),
  require('../middleware/install/addShop')
);
router.use('/merchant',
  require('../middleware/merchant/validate'),
  require('../middleware/merchant/getPaymentStatus'),
  require('../middleware/merchant/createToken'),
  function(req, res){
    req.adminDb.close();
    res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

router.use('/merchantActive', require('./merchantActive'));
router.use('/webhook', require('./webhook'));


router.use('/main.js', function(req, res, next){
  req.adminDb.close();
  res.sendFile('main.js', {root: path.join(__dirname, '../public')});
});

router.use('/cardsAccepted.png', function(req, res, next){
  req.adminDb.close();
  res.sendFile('cardsAccepted.png', {root: path.join(__dirname, '../public/images')});
});

router.use('/style.css', function(req, res, next){
  req.adminDb.close();
  res.sendFile('style.css', {root: path.join(__dirname, '../public')});
});

router.use('/', function(req, res){
  req.adminDb.close();
  res.sendFile('index.html', {root: path.join(__dirname, '../publicInstall')});
});

module.exports = router
