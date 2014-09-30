var spawn    = require('child_process').spawn
var parse    = require('shell-quote').parse
var map      = require('map-limit')
var Emitter  = require('events/')
var path     = require('path')
var glob = require('glob')
var once     = require('once')
var fs       = require('fs')

module.exports = bulk

function bulk(targets, command, done) {
  if (!Array.isArray(targets)) targets = [targets]
  done = once(done)

  var emitter = new Emitter
  var args = parse(command)
  var cmd = args.shift()

  resolveTargets(targets, function(err, targets) {
    if (err) return done(err)
    checkDirs(targets, function(err, dirs) {
      if (err) return done(err)
      doBulk(emitter, dirs, cmd, args, done)
    })
  })

  return emitter
}

function checkDirs(targets, fn) {
  map(targets, Infinity, fs.stat, function(err, stats) {
    if (err) return fn(err)
    var dirs = targets.filter(function(target, index) {
      return stats[index].isDirectory()
    })

    return fn(null, dirs)
  })
}

function doBulk(emitter, targets, cmd, args, done) {
  map(targets, 1, function(target, next) {
    var proc = spawn(cmd, args, { cwd: target })
    .once('exit', function(code) {
      if (code === 0) return next()

        return next(
          new Error('Command failed : ' + cmd + ' ' + args.join(' '))
        )
    })

    emitter.emit('spawn', target, proc)
  }, done)
}

function resolveTargets(targets, fn) {
  map(targets, Infinity, function(target, next) {
    glob(target, next)
  }, function(err, targets) {
    if (err) return fn(err)
    targets = targets.reduce(function(targets, target) {
      return targets.concat(target)
    })

    targets = targets.map(function(target) {
      return path.resolve(process.cwd(), target)
    })

    return fn(null, targets)
  })
}
