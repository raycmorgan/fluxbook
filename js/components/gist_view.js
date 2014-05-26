/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');

var GistListView = React.createClass({
  render: function () {
    var props = this.props;

    var fileView = function (name) {
      return (
        <div key={name}>
          <h3>{name}</h3>
          <pre>{props.files[name]}</pre>
        </div>
      );
    }

    return (
      <div id="gist">
        {_.keys(this.props.files).map(fileView)}
      </div>
    );
  }
});

module.exports = GistListView;
