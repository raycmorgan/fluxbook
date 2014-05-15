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
      loadingGists: this.props.gistStore.isLoading()
    }
  },

  onStoreChange: function () {
    this.setState(this.getState());
  },

  handleAuth: function (token) {
    this.props.gistActions.githubAuthenticated(token);
  },

  render: function () {
    if (this.state.loadingGists) {
      var loading = <p>Loading Gists...</p>
    }

    return (
      <div>
        {loading}
        {this.renderGists()}
      </div>
    );
  },

  renderGists: function () {
    if (this.state.publicGists.length) {
      return (
        <div>
          <GistListView title="Public Gists" gists={this.state.publicGists} />
          <GistListView title="Private Gists" gists={this.state.privateGists} />
        </div>
      );
    } else if (!this.state.loadingGists) {
      return <div><GithubAuthView onAuth={this.handleAuth} /></div>;
    } else {
      return null;
    }
  }
});

if (window) {
  window.React = React;
}

module.exports = GistAppView;
