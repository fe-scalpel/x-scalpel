var path = require('path');
var fs = require('fs');

function addExtensions(str) {
    if (!str.match(/\.[a-z]*$/)) {
        return str + '.js';
    }
    return str
}

function addDefaultFile(str) {
    return str + '/index.js';
}

var parsePath = function(str,prefix,map){
    var isF = /^\.*\//;
    var isJsfile = /(\.js|\.jsx)$/;
    var isHtml = /(\.html)$/;

    if (map && map[str]){
        return {
            source: str,
            type: 'file',
            name: map[str],
            isCollapsed: true
        }
    } else if (str.match(isF)) {
        var name ='';
        var type = '';
        if (prefix) {
            name = path.join(prefix,str);
            name[0] == '/' ? null : name = '/' + name;
        } else {
            name = path.resolve(str);
        }
        if (fs.existsSync(name) && fs.statSync(name).isDirectory()) {
            name = addDefaultFile(name);
            type = 'file';
        } else {
            name = addExtensions(name);
            type = isJsfile.test(name) ? 'file' : isHtml.test(name) ?  'html' : 'resource';
        }
        
        return {
            source: str,
            type: type,
            name: name,
            isCollapsed: true
        }
    }else {
        return {
            source: str,
            type: 'module',
            name: str
        }
    }
}

module.exports = parsePath;