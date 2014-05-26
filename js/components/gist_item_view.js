/** @jsx React.DOM */

var React = require('react');
var GistActions = require('../actions/gist_actions');
var _ = require('underscore');

var GistItemView = React.createClass({
  handleClick: function (e) {
    e.preventDefault();

    console.log('Clicked: %s', this.props.gist['id']);
    GistActions.gistSelected(this.props.gist['id']);
  },

  renderTitle: function () {
    return _.keys(this.props.gist['files']).join(', ');
  },

  render: function () {

    return (
      <li className={this.props.selected ? 'selected' : ''} id={this.props.gist['id']} onClick={this.handleClick}>
        {this.renderTitle()}
      </li>
    );
  }
});

module.exports = GistItemView;
