/** @jsx React.DOM */

var React = require('react');
var GistListView = require('./gist_list_view');
var GithubAuthView = require('./github_auth_view');
var GistView = require('./gist_view');

var GistAppView = React.createClass({
  propTypes: {
    gistStore: React.PropTypes.object.isRequired,
    gistActions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return this.getState();
  },

  componentWillMount: function () {
    this.props.gistStore.addChangeListener(this.onStoreChange)
  },

  componentWillUnmount: function () {
    this.props.gistStore.removeChangeListener(this.onStoreChange);
  },

  getState: function () {
    return {
      gists: this.props.gistStore.getAllGists(),
      isSyncing: this.props.gistStore.isSyncing(),
      selectedGist: this.props.gistStore.selectedGist(),
      isAuthenticated: this.props.githubStore.isAuthenticated(),
      files: this.props.gistStore.selectedGistFiles()
    }
  },

  onStoreChange: function () {
    this.setState(this.getState());
  },

  handleAuth: function (token) {
    this.props.gistActions.githubAuthenticated(token);
  },

  render: function () {
    var dom = [];

    if (!this.state.isAuthenticated) {
      dom.push(<div key="auth"><GithubAuthView onAuth={this.handleAuth} /></div>);
    }

    if (this.state.isSyncing) {
      dom.push(<p className="loading-message" key="syncing">Syncing Gists...</p>);
    }

    if (this.state.gists.length) {
      dom.push(<GistListView key="gists"
                             title="All Gists"
                             gists={this.state.gists}
                             selected={this.state.selectedGist} />);
    }

    if (this.state.selectedGist) {
      dom.push(<GistView key="gist" gist={this.state.selectedGist} files={this.state.files} />);
    }

    return (
      <div id="main">
        {dom}
      </div>
    );
  }
});

if (window) {
  window.React = React;
}

module.exports = GistAppView;
