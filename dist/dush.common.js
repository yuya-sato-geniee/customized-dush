'use strict';

function index () {
  var _allEvents = Object.create(null);
  var _calledEvents = Object.create(null);

  var app = {
    _allEvents: _allEvents,
    _calledEvents: _calledEvents,

    once: function once (name, handler, fireImmediately) {
      var e = app._allEvents[name] || (app._allEvents[name] = []);

      function fn () {
        if (!fn.called) {
          handler.apply(handler, arguments);
          fn.called = true;
        }
      }

      e.push(fn);

      if (fireImmediately && app._calledEvents[name]) {
        fn.apply(null, app._calledEvents[name]);
      }
      return app
    },

    emit: function emit (name) {
      var args = [].slice.call(arguments).slice(1);
      app._calledEvents[name] = args
      ;(app._allEvents[name] || []).map(function (handler) {
        handler.apply(handler, args);
      });

      return app
    }
  };

  return app
}

module.exports = index;
