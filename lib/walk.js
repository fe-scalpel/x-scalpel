var parse = require('./parse.js');
var _ = require('lodash');

var walk = function(tree,stats,map,cache){
    if (tree && tree.length) {
        tree.forEach(function(i,index){
            if (i.parsed) return;
            var ret = parse(i.name,stats,map,cache);
            if (!ret.parsed) {
                i.children = ret.children;
                walk(tree[index]['children'],stats,map,cache);
            }
        })
    }
}

module.exports = walk;