#!/usr/bin/env node

"use strict"

var split = require('split')
var through = require('through2')
var minimist = require('minimist')
var spawn = require('child_process').spawn
var parse = require('shell-quote').parse
var fs = require('fs')

var argv = minimist(process.argv, {
  boolean: ['chdir'],
  default: { 'chdir': true },
  alias: {
    d: 'chdir',
    c: 'command'
  }
})

if (!argv.command) {
  console.error('command required!')
  process.exit(1)
}

process.stdin
.pipe(split(/\s+/g))
.pipe(filterDirs(argv))
.pipe(execSeries(argv))

function filterDirs(argv) {
  if (!argv.chdir) return through()

  return through(function(item, enc, next) {
    var self = this
    item = item.toString()
    fs.stat(item, function(err, stat) {
      if (err) return next()
      if (stat.isDirectory()) self.push(item)
      return next()
    })
  })
}

function execSeries(argv) {
  return through(function(item, enc, next) {
    var cwd = process.cwd()
    var item = item.toString()
    var opts = {stdio: 'inherit', cwd: cwd}

    var args = parse(argv.command)
    var cmd = args.shift()

    if (argv.chdir) {
      opts.cwd = item
    } else {
      args.push(item)
    }

    spawn(cmd, args, opts)
    .on('error', function(err) {
      next(err)
      next = noop
    })
    .on('exit', function() {
      next()
      next = noop
    })
  })
}

function noop() {}
