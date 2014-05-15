/** @jsx React.DOM */

var Store = require('./store');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants');
var Github = require('../lib/github');
var GistActions = require('../actions/gist_actions');

var client = null;

var GithubStore = Store.create({
  client: function () {
    return client;
  }
});

var emitChange = GithubStore.emitChange;

GithubStore.registerWithDispatcher(AppDispatcher);
GithubStore.addHandler(C.GITHUB.AUTHENTICATED, function (action) {
  client = Github(action.token);
  localStorage.githubToken = action.token

  emitChange();
});

module.exports = GithubStore.finalize();
