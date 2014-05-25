var reqwest = require('reqwest');
var EventEmitter = require('events').EventEmitter;
var db = require('./db');

function Github(token) {
  if (Github.cached[token]) {
    return Github.cached[token];
  }

  var host = 'https://api.github.com/';
  var priv = {
    url: function (path, params) {
      var url = host + path + '?access_token=' + token;
      var query = [];
      var qs = '';

      for (var k in params) {
        query.push(k + '=' + params[k]);
      }

      if (query.length) {
        url += '&' + query.join('&')
      }

      return url;
    },

    get: function (path, params, callback) {
      get(priv.url(path, params), callback);
    }
  };

  var client = Github.cached[token] = {
    gists: function (opts, callback) {
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }

      priv.get('gists', opts, callback);
    },

    gistStream: function () {
      var e = new EventEmitter();
      var page = 1;
      var cancelled = false;

      var process = function (err, gists, req) {
        if (err) {
          return e.emit('error', err);
        }

        if (cancelled) {
          return;
        }

        // should optimize this by NOT making extra page req
        if (gists.length) {
          e.emit('data', gists);
          client.gists({page: ++page}, process);
        } else {
          e.emit('end');
        }
      }

      e.cancel = function () {
        cancelled = true;
        e.emit('end');
      }

      client.gists({page: page}, process);

      return e;
    }
  };

  return client;
};
Github.cached = {};

function get(url, callback) {
  console.log('HTTP request: GET %s', url);

  var r = reqwest({
    url: url,
    type: 'json',
    method: 'get',
    crossOrigin: true,
    headers: {},
    error: function (err) { callback(err, null, r.request); },
    success: function (resp) { callback(null, resp, r.request); }
  });
}

module.exports = Github;
