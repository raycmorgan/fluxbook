var AppDispatcher = require('../dispatchers/app_dispatcher');
var gistConstants = require('../constants/gist_constants');

var GistActions = {
  githubAuthenticated: function (token) {
    AppDispatcher.handleViewAction({
      actionType: gistConstants.GITHUB_AUTHENTICATED,
      token: token
    });
  }
};

module.exports = GistActions;
