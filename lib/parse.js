var fs = require('fs');
var _ = require('lodash');
var babylon = require('babylon');
var walk = require('babylon-walk');
var path = require('path');
var parseHtml = require('./parse/parseHtml');
var parseJs = require('./parse/parseJs');
var parsePath = require('./parse/parsePath');

function parse(filepath,stats,map,cache) {
  var prefix = path.resolve(path.dirname(filepath));
  var item = parsePath(filepath,null,map);
   
  if (cache[item.name]) {
    return cache[item.name];
  }

  var ret;

  if (item.type == 'module') {
    ret =  item;
  } else if (item.type == 'resource'){
    ret = item;
  } else if (item.type == 'html'){
    ret = parseHtml(item,prefix,map,stats);
  } else {
    ret = parseJs(item,prefix,map,stats);
  }

  ret.type == 'module' ? stats.module.push(ret.name) : stats.file.push(ret.name);
  cache[ret.name] = Object.assign({parsed:true},ret);
  return ret;
}

module.exports = parse;