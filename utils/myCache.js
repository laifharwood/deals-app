var NodeCache = require('node-cache');
var myCache = new NodeCache({stdTTL: 3600, checkperiod: 3605});

module.exports = myCache;
