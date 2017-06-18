var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var parsePath = require('./parsePath');

module.exports = function(item,prefix,map,stats){
    var jsMatch = /src=[\"|\']{1}(.+?)[\"|\']{1}/g;
    var cssMatch = /href=[\"|\']{1}(.+?)[\"|\']{1}/g;
    var targetMatch = /[\"|\']{1}(.+?)[\"|\']{1}/;
    var name = item.name;
    var d = [];

     try{
        content = fs.readFileSync(name);
        content = content.toString('utf8');
        var js = content.match(jsMatch) || [];
        var css = content.match(cssMatch) || [];
        var ret = js.concat(css).map(function(i){
            return i && i.match(targetMatch)[1];
        });

        ret.forEach(function(i){
            i && d.push(parsePath(i,prefix,map));
        });
    }catch(e){
        stats.error.push(name);
    }

    item.children = d;
    return item;
}
