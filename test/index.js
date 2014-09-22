var test = require('tape')
var bulk = require('../')
var bl   = require('bl')

test('basic case', function(t) {
  t.plan(5)

  bulk(__dirname + '/node_modules/@scoped', 'pwd', function(err) {
    t.ifError(err, 'completed without error')
  }).on('spawn', function(cwd, proc) {
    proc.stdout.pipe(bl(function(err, data) {
      if (err) return t.fail(err.message)
      t.equal(String(data).trim(), cwd)
    }))
  })
})

test('fail: scope does not exist', function(t) {
  bulk('missing', 'echo hello', function(err) {
    t.ok(err, 'error was created')
    t.equal(err.message, 'Directory "'+process.cwd()+'/missing" does not exist')
    t.end()
  })
})
