var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants');

var GistActions = {
  githubAuthenticated: function (token) {
    AppDispatcher.handleViewAction({
      actionType: C.GITHUB.AUTHENTICATED,
      token: token
    });
  },

  gistSelected: function (id) {
    AppDispatcher.handleViewAction({
      actionType: C.GIST.SELECTED,
      gistId: id
    });
  }
};

module.exports = GistActions;
