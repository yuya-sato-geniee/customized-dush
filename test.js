/*!
 * dush <https://github.com/tunnckoCore/dush>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (https://i.am.charlike.online)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('mukla')
var dush = require('./dist/dush.common')
var app = dush()

test('should return an instance with methods and `._allEvents` object', function (
  done
) {
  test.strictEqual(typeof app._allEvents, 'object')
  test.strictEqual(typeof app._calledEvents, 'object')
  test.strictEqual(typeof app.once, 'function')
  test.strictEqual(typeof app.emit, 'function')
  done()
})

test('should instace has ._allEvents object that contains all handlers', function (
  done
) {
  var fn = function () {}

  app.once('aaa', fn)
  app.once('aaa', fn)
  app.once('bbb', fn)
  app.once('ccc', fn)
  app.once('ccc', fn)
  app.once('ccc', fn)

  test.deepStrictEqual(Object.keys(app._allEvents), ['aaa', 'bbb', 'ccc'])
  test.strictEqual(app._allEvents.aaa.length, 2)
  test.strictEqual(app._allEvents.bbb.length, 1)
  test.strictEqual(app._allEvents.ccc.length, 3)
  done()
})

test('should instace has ._calledEvents object that contains latest called events', function (
  done
) {
  app.emit('aaa', 1)
  app.emit('aaa', 2, 3)
  app.emit('bbb', 3)
  app.emit('ccc', 4)
  app.emit('ccc', 5)
  app.emit('ccc', 6, 7, 8)

  test.deepStrictEqual(Object.keys(app._calledEvents), ['aaa', 'bbb', 'ccc'])
  test.strictEqual(app._allEvents.aaa.length, 2)
  test.strictEqual(app._allEvents.bbb.length, 1)
  test.strictEqual(app._allEvents.ccc.length, 3)
  done()
})

test('should register handlers for any type of string', function (done) {
  var app = dush()
  app.once('constructor', function (a) {
    test.ok(a === 2)
  })
  app.emit('constructor', 2)
  done()
})

test('should .emit with multiple params (maximum 3)', function (done) {
  var emitter = dush()
  emitter.once('foo', function (a, b) {
    test.strictEqual(a, 'aaa')
    test.strictEqual(b, 'bbb')
  })

  emitter.emit('foo', 'aaa', 'bbb')
  done()
})

test('should .on register multiple handlers', function (done) {
  var called = 0
  var fn = function (a) {
    called++
    test.strictEqual(a, 123)
  }

  app.once('foo', fn)
  app.once('foo', fn)
  app.emit('foo', 123)

  test.strictEqual(called, 2)
  done()
})

test('should handlers added with .once be called one time only', function (
  done
) {
  var called = 0
  app.once('bar', function (xx) {
    called++
  })

  app.emit('bar')
  app.emit('bar')
  app.emit('bar')

  test.strictEqual(called, 1)
  done()
})

test('should all methods be chainable', function (done) {
  var called = 0
  var foo = app.once('foo', function () {})
  test.ok(foo.once)

  var bar = foo.once('bar', function () {
    called++
  })
  test.ok(bar.emit)

  bar.emit('bar')

  test.strictEqual(called, 1)

  done()
})

test('should have wildcard event', function (done) {
  var app = dush()
  app.once('*', function (name, nume) {
    test.strictEqual(name, 'haha')
    test.strictEqual(nume, 444444)
  })
  app.emit('haha', 444444)
  done()
})

test('should support to emit any number of arguments', function (done) {
  dush()
    // eslint-disable-next-line max-params
    .once('zazzie', function (aa, bb, cc, dd, ee) {
      test.strictEqual(aa, 1)
      test.strictEqual(bb, 2)
      test.strictEqual(cc, 3)
      test.strictEqual(dd, 4)
      test.strictEqual(ee, 5)
      done()
    })
    .emit('zazzie', 1, 2, 3, 4, 5)
})

test('should be able to pass context to listener', function (done) {
  function listener (hi) {
    test.strictEqual(hi, 'hello world')
    test.strictEqual(this.aaa, 'bbb')
    done()
  }

  var ctx = { aaa: 'bbb' }
  var app = dush()
  app.once('ctx', listener.bind(ctx))
  app.once('ctx', listener.bind(ctx))
  app.emit('ctx', 'hello world')
})

test('should context of listener be the listener', function (done) {
  function fnc () {
    test.strictEqual(typeof this, 'function')
    done()
  }
  app.once('func', fnc)
  app.emit('func')
})

// custom test

test('should `fireImmediately` works well on emit -> once', function (done) {
  var count = 0
  app.emit('aaaaa', 1, 2, 3)
  app.once('aaaaa', function (a, b, c) {
    count += a + b + c
  }, true)
  test.strictEqual(count, 6)
  app.emit('aaaaa', 4, 5)
  test.strictEqual(count, 6)
  done()
})

test('should `fireImmediately` works well on once -> emit', function (done) {
  var count = 0
  app.once('bbbbb', function (a, b, c) {
    count += a + b + c
  })
  test.strictEqual(count, 0)
  app.emit('bbbbb', 1, 2, 3)
  test.strictEqual(count, 6)
  app.emit('bbbbb', 1, 2, 3)
  test.strictEqual(count, 6)
  done()
})

test('multi defined `fireImmediately`', function (done) {
  var count = 0
  app.emit('ccccc')
  app.emit('ccccc')
  app.once('ccccc', function () { count += 1 }, true)
  app.once('ccccc', function () { count += 2 }, false)
  app.once('ccccc', function () { count += 4 }, true)
  test.strictEqual(count, 5)
  app.emit('ccccc')
  app.emit('ccccc')
  test.strictEqual(count, 7)
  done()
})
