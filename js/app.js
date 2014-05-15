/** @jsx React.DOM */

var React = require('react');

var GistAppView = require('./components/gist_app_view');
var GistStore = require('./stores/gist_store');
var GistActions = require('./actions/gist_actions');

if (localStorage.githubToken) {
  GistActions.githubAuthenticated(localStorage.githubToken);
}

// OAuth
OAuth.initialize('rRW8z4osjyMGc2rtUmJJm0U1qso');

React.renderComponent(
  <GistAppView gistStore={GistStore} gistActions={GistActions} />,
  document.body);
