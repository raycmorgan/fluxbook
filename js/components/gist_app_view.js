/** @jsx React.DOM */

var React = require('react');
var GistListView = require('./gist_list_view');
var GithubAuthView = require('./github_auth_view');

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
      publicGists: this.props.gistStore.getPublicGists(),
      privateGists: this.props.gistStore.getPrivateGists(),
      isSyncing: this.props.gistStore.isSyncing(),
      selectedGist: this.props.gistStore.selectedGist()
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

    if (!this.state.publicGists.length && !this.state.isSyncing) {
      dom.push(<div key="auth"><GithubAuthView onAuth={this.handleAuth} /></div>);
    }

    if (this.state.isSyncing) {
      dom.push(<p key="syncing">Syncing Gists...</p>);
    }

    if (this.state.publicGists.length) {
      dom.push(<GistListView key="public-gists" title="Public Gists" gists={this.state.publicGists} selected={this.state.selectedGist} />)
    }

    if (this.state.privateGists.length) {
      dom.push(<GistListView key="private-gists" title="Private Gists" gists={this.state.privateGists} selected={this.state.selectedGist} />)
    }

    return (
      <div>
        {dom}
      </div>
    );
  }
});

if (window) {
  window.React = React;
}

module.exports = GistAppView;
