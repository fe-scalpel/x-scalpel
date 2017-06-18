### 通过入口文件分析项目依赖，并可视化展现
### 检测项目中可能废弃的文件或者依赖


![](https://img.alicdn.com/tfs/TB1Bpm8RpXXXXcHXpXXXXXXXXXX-1393-599.png)

```
var scalpel = require('x-scalpel');
var path = require('path');

var config = {
    nodeHaste:false, // node-haste 解析支持
    entry:path.resolve('./js/Go/Entry.js'),
    root: path.resolve('./js'),
    packageJson: path.resolve('./package.json'),
    fileFilter: /^\.|node_modules|.+\.md/,
    fileMatch: function(a,b){
        if (/\.png|\.jpg/.test(a)) {
            return a.replace('@2x','').replace('@3x','') == b;
        } else {
            return a == b;
        }
    }
}

scalpel(config);

```