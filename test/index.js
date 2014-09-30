var test = require('tape')
var bulk = require('../')
var bl   = require('bl')

test('basic case', function(t) {
  t.plan(5)

  bulk(__dirname + '/node_modules/@scoped/*', 'pwd', function(err) {
    t.ifError(err, 'completed without error')
  }).on('spawn', function(cwd, proc) {
    proc.stdout.pipe(bl(function(err, data) {
      if (err) return t.fail(err.message)
      t.equal(String(data).trim(), cwd)
    }))
  })
})

test('matches globs only for directories', function(t) {
  var items = []
  var DIR = __dirname + '/dirs-and-files/'
  bulk(DIR + '/*', 'pwd', function(err) {
    t.ifError(err, 'completed without error')
    t.deepEqual(items.sort(), [
      DIR + 'a',
      DIR + 'b'
    ].sort())
    t.end()
  }).on('spawn', function(cwd, proc) {
    proc.stdout.pipe(bl(function(err, data) {
      if (err) return t.fail(err.message)
      items.push(String(data).trim())
    }))
  })
})
