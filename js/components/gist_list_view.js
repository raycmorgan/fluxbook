/** @jsx React.DOM */

var React = require('react');
var GistItemView = require('./gist_item_view');

var GistListView = React.createClass({
  render: function () {
    var props = this.props;
 
    var createGist = function (gist) {
      return <GistItemView selected={gist == props.selected} gist={gist} key={gist['id']} />
    }

    return (
      <div>
        <h3>{this.props.title}</h3>
        <ul>
          {this.props.gists.map(createGist)}
        </ul>
      </div>
    );
  }
});

module.exports = GistListView;
