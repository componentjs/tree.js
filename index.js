
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
 * CALLBACKS ARE FINE OK
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

module.exports = function(path, fn){
  var tree = {};

  var batch = new Batch;
  batch.concurrency(8);

  // ./<user>
  readdir(path, function(err, users){
    if (err) return fn(err);

    users.forEach(function(user){
      batch.push(function(done){
        var dir = join(path, user);
        tree[user] = tree[user] || {};

        // ./<user>/<repo>
        readdir(dir, function(err, pkgs){
          if (err) return done(err);

          pkgs.forEach(function(pkg){
            tree[user][pkg] = tree[user][pkg] || {};

            // ./<user>/<repo>/<versions>
            readdir(join(dir, pkg), function(err, versions){
              if (err) return done(err);
              var b = new Batch;
              b.concurrency(8);

              versions.forEach(function(version){
                b.push(function(done){

                  // ./<user>/<repo>/<versions>/component.json
                  var path = join(dir, pkg, version, 'component.json');

                  read(path, 'utf8', function(err, json){
                    if (err) return done(err);

                    try {
                      var obj = JSON.parse(json);
                    } catch (err) {
                      return done(err);
                    }

                    tree[user][pkg][version] = obj;
                    done();
                  });
                })
              });

              b.end(done);
            });
          });
        });
      })
    });

    batch.end(function(err){
      fn(err, tree);
    });
  });
};