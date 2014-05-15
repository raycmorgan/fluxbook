var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants');

var GistActions = {
  githubAuthenticated: function (token) {
    AppDispatcher.handleViewAction({
      actionType: C.GITHUB.AUTHENTICATED,
      token: token
    });
  }
};

module.exports = GistActions;
