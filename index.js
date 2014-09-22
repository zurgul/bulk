var spawn    = require('child_process').spawn
var parse    = require('shell-quote').parse
var map      = require('map-limit')
var Emitter  = require('events/')
var findup   = require('findup')
var path     = require('path')
var once     = require('once')
var fs       = require('fs')

module.exports = bulk

function bulk(dirname, command, done) {
  dirname = path.resolve(process.cwd(), dirname)
  done    = once(done)

  var emitter = new Emitter
  var arg = parse(command)
  var cmd = arg.shift()
  var env = process.env

  findup(dirname, 'package.json', found)

  return emitter

  function found(err, root) {
    if (err) return done(err)

    //var node_modules = path.join(
      //root = path.resolve(root || dirname)
    //, 'node_modules', '@' + namespace)

    fs.exists(dirname, function(exists) {
      if (!exists) return done(new Error(
        'Directory "'+dirname+'" does not exist'
      ))

      fs.readdir(dirname, function(err, children) {
        if (err) return done(err)

        children = children.map(function(child) {
          return path.join(dirname, child)
        })

        doBulk(children)
      })
    })
  }

  function doBulk(packages) {
    map(packages, 1, function(package, next) {
      setTimeout(function() {
        var proc = spawn(cmd, arg, {
            cwd: package
          , env: env
        }).once('exit', function(code) {
          if (code === 0) return next()

          return next(
            new Error('Invalid error code: ' + code)
          )
        })

        emitter.emit('spawn', package, proc)
      }, 5)
    }, done)
  }
}
