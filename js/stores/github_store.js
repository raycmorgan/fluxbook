/** @jsx React.DOM */

var Store = require('./store');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants/gist_constants');
var Github = require('../lib/github');

var client = null;

var GithubStore = Store.create({
  client: function () {
    return client;
  }
});

var emitChange = GithubStore.emitChange;

GithubStore.registerWithDispatcher(AppDispatcher);
GithubStore.addHandler(C.GITHUB_AUTHENTICATED, function (action) {
  client = Github(action.token);
  emitChange();
})

module.exports = GithubStore.finalize();
