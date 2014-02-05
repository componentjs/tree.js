
var tree = require('./');
var inspect = require('util').inspect;
var path = process.argv[2];

console.log('tree of %s', path);
tree(path, function(err, tree){
  if (err) throw err;
  console.log(inspect(tree, { colors: true, depth: Infinity }));
});