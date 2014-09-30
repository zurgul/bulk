#!/usr/bin/env node

var quote = require('shell-quote').quote
var minimist = require('minimist')
var path = require('path')
var bulk = require('./')
var map = require('map-limit')
var fs = require('fs')

var cwd = process.cwd()
var argv = minimist(process.argv.slice(2))
cmd = quote(argv._.pop())
var targets = argv._.slice()

if (!targets.length) return bail('Please specify targets to use.')
if (!cmd.trim()) return bail('Please specify a command to run.')

targets = targets.reduce(function(targets, target) {
  return targets.concat(glob(target))
})

bulk(targets, cmd, function(err) {
  if (err) throw err
}).on('spawn', function(CWD, proc) {
  console.error()
  console.error(path.relative(cwd, CWD))
  console.error('> ' + cmd)
  console.error()

  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
})

function bail(err) {
  console.error()
  console.error(err)
  console.error()

  fs.createReadStream(path.join(__dirname, 'usage.txt'))
    .once('close', function() { console.error() })
    .pipe(process.stderr)
}
