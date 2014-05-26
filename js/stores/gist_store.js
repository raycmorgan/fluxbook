/** @jsx React.DOM */

// var merge = require('react/lib/merge');
var Store = require('./store');
var AppDispatcher = require('../dispatchers/app_dispatcher');
var C = require('../constants');
var GithubStore = require('./github_store');
var db = require('../lib/db');
var _ = require('underscore');

var gists = [];
var selectedGist = null;
var selectedGistFiles = {};
var isSyncing = false;

var GistStore = Store.create({
  getAllGists: function () {
    return gists;
  },

  getPublicGists: function () {
    return gists.filter(function (gist) {
      return gist['public'];
    });
  },

  getPrivateGists: function () {
    return gists.filter(function (gist) {
      return !gist['public'];
    });
  },

  isSyncing: function () {
    return isSyncing;
  },

  selectedGist: function () {
    return _.findWhere(gists, {id: selectedGist});
  },

  selectedGistFiles: function () {
    return selectedGistFiles;
  }
});

// Dispatch handlers

GistStore.registerWithDispatcher(AppDispatcher);

GistStore.addHandler(C.GITHUB.AUTHENTICATED, function (action) {
  AppDispatcher.waitFor([GithubStore], refreshGists);
});

GistStore.addHandler(C.GIST.SELECTED, function (action) {
  selectedGist = action.gistId;
  emitChange();

  var gist = _.findWhere(gists, {id: selectedGist})
  GithubStore.client().gistFiles(gist, function (err, files) {
    if (err) {
      return console.error(err);
    }

    selectedGistFiles = files;
    emitChange();
  });
});


// Internal Helpers

var emitChange = GistStore.emitChange;

function refreshGists() {
  isSyncing = true;
  emitChange();

  var stream = GithubStore.client().gistStream();
  var _gists = [];

  stream.on('data', function (data) {
    console.log('Loaded page:', data);

    var hasChange = false;

    _gists = _gists.concat(data);
    gists = _gists;

    _gists.forEach(function (gist) {
      db.get('gists', gist['id'], function (err, obj) {
        if (err) {
          return console.error(err);
        }

        if (obj) {
          if (obj['updated_at'] != gist['updated_at']) {
            hasChange = true;
            db.put('gists', gist, function (err) {
              if (err) { console.error(err); }
            });
          }
        } else {
          hasChange = true;
          db.put('gists', gist, function (err) {
            if (err) { console.error(err); }
          });
        }
      });
    });

    if (hasChange) {
      fetchThenChange();
    }
  });

  stream.on('error', function (err) {
    console.error(err);
    end();
  });

  stream.on('end', end);

  function end() {
    isSyncing = false;
    fetchThenChange();
  }
}

function fetchThenChange() {
  var keyRange = IDBKeyRange.lowerBound("");

  db.allByIndex('gists', 'updated_at', keyRange, {desc: true}, function (err, results) {
    if (err) {
      return console.error(err);
    }

    gists = results;
    emitChange();
  });
}

fetchThenChange();


// Exports

module.exports = GistStore.finalize();
