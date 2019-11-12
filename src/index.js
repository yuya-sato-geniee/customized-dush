'use strict'

export default function () {
  let _allEvents = Object.create(null)
  let _calledEvents = Object.create(null)

  const app = {
    _allEvents,
    _calledEvents,

    once (name, handler, fireImmediately) {
      let e = app._allEvents[name] || (app._allEvents[name] = [])

      function fn () {
        if (!fn.called) {
          handler.apply(handler, arguments)
          fn.called = true
        }
      }

      e.push(fn)

      if (fireImmediately && app._calledEvents[name]) {
        fn.apply(null, app._calledEvents[name])
      }
      return app
    },

    emit (name) {
      var args = [].slice.call(arguments).slice(1)
      app._calledEvents[name] = args
      ;(app._allEvents[name] || []).map((handler) => {
        handler.apply(handler, args)
      })

      return app
    }
  }

  return app
}
