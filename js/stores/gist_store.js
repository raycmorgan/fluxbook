/** @jsx React.DOM */

// var merge = require('react/lib/merge');
var Store = require('./store');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants/gist_constants');
var GithubStore = require('./github_store');

var gists = [];
var isLoading = false;

var GistStore = Store.create({
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
  }
});

// Dispatch handlers

GistStore.registerWithDispatcher(AppDispatcher);

GistStore.addHandler(C.GITHUB_AUTHENTICATED, function (action) {
  AppDispatcher.waitFor([GithubStore], refreshGists);
});


// Internal Helpers

var emitChange = GistStore.emitChange;

function refreshGists() {
  isLoading = true;
  emitChange();

  GithubStore.client().gists(function (err, data) {
    isLoading = false;
    gists = data;
    emitChange();
  });
}


// Exports

module.exports = GistStore.finalize();
