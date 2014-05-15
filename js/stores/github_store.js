
/** @jsx React.DOM */

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var Github = require('../lib/github');
var gistConstants = require('../constants/gist_constants');

var CHANGE_EVENT = 'CHANGE_EVENT';

var client = null;

GithubStore = merge(EventEmitter.prototype, {
  client: function () {
    return client;
  },

  addChangeListener: function (fn) {
    this.on(CHANGE_EVENT, fn);
  },

  removeChangeListener: function (fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }
});

function emitChange() {
  GithubStore.emit(CHANGE_EVENT);
}

GithubStore.dispatchIndex = AppDispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {
    case gistConstants.GITHUB_AUTHENTICATED:
      return handleGithubAuthenticated(action);

    default:
      return true;
  }
});

function handleGithubAuthenticated(action) {
  client = Github(action.token);
  emitChange();
}

module.exports = GithubStore;
