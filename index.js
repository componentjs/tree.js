
/**
 * Module dependencies.
 */

var Batch = require('batch');
var path = require('path');
var fs = require('fs');
var readdir = fs.readdir;
var read = fs.readFile;
var join = path.join;

/**
 * Load component tree from `path`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

module.exports = function(path, fn){
  var tree = {};

  users(tree, path, function(err){
    fn(err, tree);
  });
};

/**
 * ./components/<user>
 */

function users(tree, path, fn) {
  readdir(path, function(err, users){
    var batch = new Batch;
    batch.concurrency(6);

    users.forEach(function(user){
      tree[user] = tree[user] || {};

      batch.push(function(done){
        repos(tree[user], join(path, user), done);
      });
    });

    batch.end(fn);
  });
}

/**
 * ./components/<user>/<repo>
 */

function repos(tree, path, fn) {
  readdir(path, function(err, repos){
    var batch = new Batch;
    batch.concurrency(6);

    repos.forEach(function(repo){
      tree[repo] = tree[repo] || {};

      batch.push(function(done){
        versions(tree[repo], join(path, repo), done);
      });
    });

    batch.end(fn);
  });
}

/**
 * ./components/<user>/<repo>/<versions>
 */

function versions(tree, path, fn) {
  readdir(path, function(err, versions){
    var batch = new Batch;
    batch.concurrency(6);

    versions.forEach(function(version){
      batch.push(function(done){
        var file = join(path, version, 'component.json');

        read(file, 'utf8', function(err, json){
          if (err) return done(err);

          try {
            var obj = JSON.parse(json);
          } catch (err) {
            return done(err);
          }

          tree[version] = obj;
          done();
        });
      });
    });

    batch.end(fn);
  });
}