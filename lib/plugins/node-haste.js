var babylon = require('babylon');
var walk = require('babylon-walk');
var fs = require('fs');
var _ = require('lodash');
var match = /providesModule\s+(.*)/;

function parse(content){
    var ret = null;
	content = content.toString('utf8');
	try {
        var ast = babylon.parse(content, { 
            sourceType: 'module' ,
            plugins: ['jsx','objectRestSpread','flow','decorators','classProperties','exportExtensions','asyncGenerators','functionBind','functionSent','templateInvalidEscapes']
        });
        var comments = ast.comments;
        comments.forEach(function(i){
            var _m = i.value.match(match);
            if (_m) {
                ret = _m[1];
            }
        });
    }catch(e){
    }
    return ret;
}

function genPromise(filepath,map){
    return new Promise(function(resolve,reject){
        fs.readFile(filepath, function(err, content){
            if (err) {
                console.log(err);
            } else {
                var ret = parse(content);
                if (ret) {
                    map[ret] = filepath;
                }
            }
            resolve();
        });
    });
}

module.exports = function(list){
     var promises = [];
     var map ={};
     list.forEach(function(i){
        if (/(\.js|\.jsx)$/.test(i)) {
            promises.push(genPromise(i,map));
        }
    })

    return Promise.all(promises).then(function(){
        return map;
    });
}