var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var express = require('express');
var ejs = require('ejs');
var openbrowser = require('openbrowser');
var mkdir = require('mkdirp');
var projectRoot = path.resolve(__dirname, '..');

module.exports = {
  start
};

function start(obj,stats,opts) {
  var {
    port = 8888,
    host = '127.0.0.1',
    openBrowser = true,
    bundleDir = null
  } = opts || {};

  var chartData = obj;

  if (!chartData) return;

  var app = express();
  
  app.engine('ejs', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  app.set('views', `${projectRoot}/views`);
  app.use(express.static(`${projectRoot}/public`));

  app.use('/', (req, res) => {
    res.render('viewer', {
      chartData: JSON.stringify(chartData),
      stats: stats,
      root: opts.root
    });
  });

  return app.listen(port, host, () => {
    var url = `http://${host}:${port}`;

    if (openBrowser) {
      openbrowser(url);
    }
  });
}



