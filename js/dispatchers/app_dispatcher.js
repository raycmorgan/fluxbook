// var storeCallbacks = [];
// 
// var dispatch = function (payload) {
//   return storeCallbacks.every(function (callback) {
//     return callback(payload);
//   });
// }
// 
// module.exports = {
//   register: function (callback) {
//     storeCallbacks.push(callback);
//     return storeCallbacks.length - 1;
//   },
// 
//   registerHandlers: function (handlers) {
//     return this.register(function (payload) {
//       var action = payload.action;
// 
//       if (typeof handlers[action.actionType] === 'function') {
//         return handlers[action.actionType](action);
//       } else {
//         return true;
//       }
//     });
//   },
// 
//   handleViewAction: function (action) {
//     return dispatch({
//       source: 'VIEW_ACTION',
//       action: action
//     });
//   }
// };


var merge = require('react/lib/merge');
var Dispatcher = require('./dispatcher');

var AppDispatcher = merge(Dispatcher.prototype, {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  }

});

module.exports = AppDispatcher;
