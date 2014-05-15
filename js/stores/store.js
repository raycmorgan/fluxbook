/** @jsx React.DOM */

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var CHANGE_EVENT = 'CHANGE_EVENT';

var Store = merge(EventEmitter.prototype, {
  addChangeListener: function (fn) {
    this.on(CHANGE_EVENT, fn);
  },

  removeChangeListener: function (fn) {
    this.removeListener(CHANGE_EVENT, fn);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addHandler: function (actionType, callback) {
    this.handlers[actionType] = callback;
  },

  registerWithDispatcher: function (dispatcher, callback) {
    var handlers = this.handlers;

    this.dispatchIndex = dispatcher.register(function (payload) {
      var action = payload.action;

      if (typeof handlers[action.actionType] === 'function') {
        return handlers[action.actionType](action);
      } else {
        return true;
      }
    }.bind(this));
  },

  finalize: function () {
    // remove all "private" functions
    delete this.emitChange;
    delete this.registerWithDispatcher;
    delete this.finalize;
    delete this.handlers;
    delete this.addHandler;

    return this;
  }
});

function create(obj) {
  store = merge(Store, obj);
  store.emitChange = store.emitChange.bind(store);
  store.handlers = {};

  return store;
}

exports.create = create;
