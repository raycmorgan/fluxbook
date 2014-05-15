/** @jsx React.DOM */

var React = require('react');

var GistItemView = React.createClass({
  render: function () {
    return (
      <li>
        <span>
          ID: {this.props.gist['id']} 
          <small>({this.props.gist['public'] ? 'public' : 'private'})</small>
        </span><br />
        <span>URL: <a href={this.props.gist['html_url']}>
          {this.props.gist['html_url']}
        </a></span>
      </li>
    );
  }
});

module.exports = GistItemView;
