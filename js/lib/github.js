function Github(token) {
  if (Github.cached[token]) {
    return Github.cached[token];
  }

  var host = 'https://api.github.com/';
  var priv = {
    url: function url(path, params) {
      params = '';
      return host + path + '?access_token=' + token + '&' + params;
    },

    get: function get(path, params, callback) {
      $.getJSON(priv.url(path, params), function (data, _, xhr) {
        var headers = xhr.getResponseHeader.bind(xhr);
        callback(null, data, headers);
      });
    }
  };

  return Github.cached[token] = {
    gists: function (callback) {
      priv.get('gists', {}, callback);
    }
  };
};
Github.cached = {};

module.exports = Github;
