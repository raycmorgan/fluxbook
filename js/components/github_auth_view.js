/** @jsx React.DOM */

var React = require('react');

function githubAuth(callback) {
  OAuth.popup('github', callback);
}

var GithubAuthView = React.createClass({
  getInitialState: function () {
    return {error: null};
  },

  handleClick: function (e) {
    e.preventDefault();

    githubAuth(function (err, result) {
      if (err) {
        this.setState({error: "Failed to authenticate with Github."});
      } else {
        this.props.onAuth(result['access_token']);
      }
    }.bind(this));
  },

  render: function () {
    var error = null;

    if (this.state.error) {
      error = <p class="error">{this.state.error}</p>;
    }

    return (
      <div>
        {error}
        <a onClick={this.handleClick} href="">Auth with Github</a>
      </div>
    );
  }
});

module.exports = GithubAuthView;
