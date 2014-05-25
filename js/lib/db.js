var DB_VERSION = 8;
var db = null;

function open(callback) {
  var request = indexedDB.open('fluxbook', DB_VERSION);

  request.onupgradeneeded = function (e) {
    var db = e.target.result;
    var transaction = e.target.transaction;

    transaction.onerror = _error(callback);

    // Remove the old version of the store (instead of dealing with upgrades)
    if (db.objectStoreNames.contains("gists")) {
      db.deleteObjectStore("gists");
    }

    var gists = db.createObjectStore("gists", {keyPath: "id"});
    gists.createIndex('created_at', 'created_at');
    gists.createIndex('updated_at', 'updated_at');

    var github = db.createObjectStore('github', {keyPath: "url"});
  };

  request.onsuccess = function (e) {
    db = e.target.result;
    callback();
  };

  request.onerror = _error(callback);
}

function get(name, id, callback) {
  var txn = db.transaction([name], 'readonly');
  var store = txn.objectStore(name);

  var request = store.get(id);

  request.onsuccess = function (e) {
    callback(null, e.target.result);
  }

  request.onerror = _error(callback);
}

function all(name, callback) {
  var txn = db.transaction([name], 'readonly');
  var store = txn.objectStore(name);

  var keyRange = IDBKeyRange.lowerBound("");
  var cursorRequest = store.openCursor(keyRange);

  var values = [];

  cursorRequest.onsuccess = function(e) {
    var cursor = e.target.result;

    if (cursor) {
      values.push(cursor.value);
      cursor.continue();
    } else {
      callback(null, values);
    }
  };

  cursorRequest.onerror = _error(callback);
}

function allByIndex(name, indexName, keyRange, callback) {
  var txn = db.transaction([name], 'readonly');
  var store = txn.objectStore(name);
  var index = store.index(indexName);

  var cursorRequest = index.openCursor(keyRange);

  var values = [];

  cursorRequest.onsuccess = function(e) {
    var cursor = e.target.result;

    if (cursor) {
      values.push(cursor.value);
      cursor.continue();
    } else {
      callback(null, values);
    }
  };

  cursorRequest.onerror = _error(callback);
}


function put(name, obj, callback) {
  var txn = db.transaction([name], 'readwrite');
  var store = txn.objectStore(name);

  var request = store.put(obj);

  request.onsuccess = function (e) {
    callback(null);
  }

  request.onerror = _error(callback);
}




function _error(callback) {
  return function (e) {
    callback(e.target.error);
  };
}

exports.open = open;
exports.get = get;
exports.all = all;
exports.allByIndex = allByIndex;
exports.put = put;


// Database.create('gists', {
//   gists: {
//     setup: {keyPath: 'id'},
//     indexes: [
//       ['created_at'],
//       ['updated_at'],
//       ['public', 'updated_at']
//     ]
//   }
// })
