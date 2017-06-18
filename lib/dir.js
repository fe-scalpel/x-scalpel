var fs = require('fs');
var path = require('path');

function read(root, ignore, files, prefix) {
  prefix = prefix || '';
  files = files || [];

  var dir = path.join(root, prefix);
  if (!fs.existsSync(dir)) return files;
  if (fs.statSync(dir).isDirectory()) {
    fs.readdirSync(dir)
      .filter(function(file){
        return !file.match(ignore);
      })
      .forEach(function (name) {
        read(root, ignore, files, path.join(prefix, name));
      });
  } else if (!prefix.match(ignore)) {
     files.push(path.resolve(root,prefix));
  }

  return files;
}

module.exports = {
  read
};