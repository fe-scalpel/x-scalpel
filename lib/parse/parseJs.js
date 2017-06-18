var fs = require('fs');
var _ = require('lodash');
var babylon = require('babylon');
var walk = require('babylon-walk');
var path = require('path');
var parsePath = require('./parsePath');

function getParam(node,ret){
	if (node.callee ){
		node.arguments.forEach(function(i){
			ret.push(i);
		})
		getParam(node.callee,ret);
	}
}


function getRequire(node,ret){
	if (node.callee){
		if (node.callee.name == 'require'){
			var value = node.arguments[0] && node.arguments[0].value;
			ret.push(value);
		}
		getRequire(node.callee,ret);
	}
}

function _walk(ast,d,prefix,map){
     walk.recursive(
        ast,
        {
            ImportDeclaration(node, state, c) {
                var value = node.source && node.source.value;
                if (value) {
                    var ret = parsePath(value,prefix,map);
                    d.push(ret);
                }
            },
            CallExpression(node, state, c) {
                var ret = [];
                var params = [];
                getRequire(node,ret);
                getParam(node,params);
                params.forEach(function(i){
					_walk(i,d,prefix,map);
				});
                ret.forEach(function(i){
                    d.push(parsePath(i,prefix,map))
                });
            }
        },
        {}
    );
}

module.exports = function(item,prefix,map,stats){
    var ret = {};
    var name = item.name;
    var content;
    var ast;
    var d = [];
    
    try{
        content = fs.readFileSync(name);
        content = content.toString('utf8');
        ast = babylon.parse(content, { 
            sourceType: 'module' ,
            plugins: ['jsx','objectRestSpread','flow','classProperties','decorators','exportExtensions','asyncGenerators','functionBind','functionSent','templateInvalidEscapes']
        });
        
        _walk(ast,d,prefix,map);

    }catch(e){
        stats.error.push(name);
    }

    if (!ast){
        return {};
    }
    item.children = d;
    return item;
}