/** @jsx React.DOM */

var React = require('react');
var GistActions = require('../actions/gist_actions');

var GistItemView = React.createClass({
  handleClick: function (e) {
    e.preventDefault();

    console.log('Clicked: %s', this.props.gist['id']);
    GistActions.gistSelected(this.props.gist['id']);
  },

  render: function () {
    return (
      <li className={this.props.selected ? 'selected' : ''} id={this.props.gist['id']} onClick={this.handleClick}>
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
