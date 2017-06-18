var walk = require('./lib/walk.js');
var dir = require('./lib/dir.js');
var view = require('./lib/view.js');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
var chalk = require('chalk');
var nodeHaste = require('./lib/plugins/node-haste.js');
var map = {};

var stats = {
    error:[],
    file:[],
    module:[]
}

module.exports = function(config){
    config = Object.assign({
        nodeHaste: false,
        entry:'',
        root: './',
        packageJson: './package.json',
        fileFilter: /^\.|node_modules|.+\.md/,
        fileMatch:function(a,b){
            return a == b;
        }
    },config)

    var root = path.resolve(config.root);
    var allfiles = dir.read(root,config.fileFilter);
    var packageJson = require(config.packageJson);
    var dependencies = packageJson.dependencies;
    var tree = {name:'root',children:[]};
    var unused = {file:[],module:[]};
    var entry = _.isArray(config.entry) ? config.entry : [config.entry];
    var preTask = Promise.resolve();
    var cache = {};

    if (config.nodeHaste) {
        preTask = nodeHaste(allfiles);  
    }

    entry.forEach(function(i){
          tree.children.push({
              name:i,
              children:[]
          })     
    });

    console.log(chalk.green('running...'));

    preTask.then(function(map){
        walk(tree.children,stats,map,cache);

        for(var i in stats){
            stats[i] = _.uniq(stats[i]);
        }
        
        fs.writeFileSync('./stats.json',JSON.stringify(stats.file,null,4));

        allfiles.forEach(function(i){
            var item = stats.file.findIndex(function(j){
                return config.fileMatch(i,j);
            });
            
            if (item == -1) {
                unused.file.push(i);
            }
        });

        Object.keys(dependencies).forEach(function(i){
            if (stats.module.indexOf(i)<0) {
                unused.module.push(i);
            }
        });

        unused.error = stats.error;
        
        view.start(tree,unused,{
            root: path.resolve(config.root)
        });

        console.log(chalk.green('finish!'));
    })
};