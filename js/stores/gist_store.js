/** @jsx React.DOM */

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var gistConstants = require('../constants/gist_constants');
var GithubStore = require('./github_store');

var CHANGE_EVENT = 'CHANGE_EVENT';

var gists = [];
var isLoading = false;

GistStore = merge(EventEmitter.prototype, {
  getAllGists: function () {
    return gists;
  },

  getPublicGists: function () {
    return gists.filter(function (gist) {
      return gist['public'];
    });
  },

  getPrivateGists: function () {
    return gists.filter(function (gist) {
      return !gist['public'];
    });
  },

  isLoading: function () {
    return isLoading;
  },

  addChangeListener: function (fn) {
    this.on(CHANGE_EVENT, fn);
  },

  removeChangeListener: function (fn) {
    this.removeListener(CHANGE_EVENT, fn);
  }
});

function emitChange() {
  GistStore.emit(CHANGE_EVENT);
}

GistStore.dispatchIndex = AppDispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {
    case gistConstants.GITHUB_AUTHENTICATED:
      return handleGithubAuthenticated(action);

    default:
      return true;
  }
});

function handleGithubAuthenticated(action) {
  AppDispatcher.waitFor([GithubStore], function () {
    isLoading = true;
    emitChange();

    GithubStore.client().gists(function (err, data) {
      isLoading = false;
      gists = data;
      emitChange();
    });
  });
}

module.exports = GistStore;
