
/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag.
 * That's why we have to inline the whole event emitter implementation here.
 */
function installHook(target) {
  if (target.hasOwnProperty('__RELAY_DEVTOOLS_HOOK__')) {
    return null;
  }

  var listeners = {};
  var environments = new Map();
  var uidCounter = 0;

  function registerEnvironment(environment) {
    var id = ++uidCounter;
    environments.set(id, environment);
    hook.emit('environment', {
      id: id,
      environment: environment
    });
    return id;
  }

  function sub(event, fn) {
    hook.on(event, fn);
    return function () {
      return hook.off(event, fn);
    };
  }

  function on(event, fn) {
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(fn);
  }

  function off(event, fn) {
    if (!listeners[event]) {
      return;
    }

    var index = listeners[event].indexOf(fn);

    if (index !== -1) {
      listeners[event].splice(index, 1);
    }

    if (!listeners[event].length) {
      delete listeners[event];
    }
  }

  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].map(function (fn) {
        return fn(data);
      });
    }
  }

  var environmentWrappers = new Map();
  var hook = {
    registerEnvironment: registerEnvironment,
    environmentWrappers: environmentWrappers,
    // listeners,
    environments: environments,
    emit: emit,
    // inject,
    on: on,
    off: off,
    sub: sub
  };
  Object.defineProperty(target, '__RELAY_DEVTOOLS_HOOK__', {
    // This property needs to be configurable for the test environment,
    // else we won't be able to delete and recreate it beween tests.
    configurable: true,
    enumerable: false,
    get: function get() {
      return hook;
    }
  });
  return hook;
}


// FROM INDEX.JS

/***/ "../../src/backend/index.js":
/*!*******************************************************************************************!*\
  !*** /Users/aryehkobrinsky/Desktop/CS/projects/Relay/relay-devtools/src/backend/index.js ***!
  \*******************************************************************************************/
/*! exports provided: initBackend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  __webpack_require__.r(__webpack_exports__);
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initBackend", function() { return initBackend; });
  /* harmony import */ var _EnvironmentWrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EnvironmentWrapper */ "../../src/backend/EnvironmentWrapper.js");
  /**
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   * 
   */
  
  function initBackend(hook, agent, global) {
    var subs = [hook.sub('environment.event', function (data) {
      agent.onEnvironmentEvent(data);
    }), hook.sub('environment.store', function (data) {
      agent.onStoreData(data);
    }), hook.sub('environment-attached', function (_ref) {
      var id = _ref.id,
          environment = _ref.environment,
          environmentWrapper = _ref.environmentWrapper;
      agent.setEnvironmentWrapper(id, environmentWrapper);
      agent.onEnvironmentInitialized({
        id: id,
        environmentName: environment.configName
      }); // Now that the Store and the renderer interface are connected,
      // it's time to flush the pending operation codes to the frontend.
  
      environmentWrapper.flushInitialOperations();
    })];
  
    var attachEnvironment = function attachEnvironment(id, environment) {
      var environmentWrapper = hook.environmentWrappers.get(id); // Inject any not-yet-injected renderers (if we didn't reload-and-profile)
  
      if (!environmentWrapper) {
        environmentWrapper = Object(_EnvironmentWrapper__WEBPACK_IMPORTED_MODULE_0__["attach"])(hook, id, environment, global);
        hook.environmentWrappers.set(id, environmentWrapper);
      } // Notify the DevTools frontend about new renderers.
  
  
      hook.emit('environment-attached', {
        id: id,
        environment: environment,
        environmentWrapper: environmentWrapper
      });
    }; // Connect renderers that have already injected themselves.
  
  
    hook.environments.forEach(function (environment, id) {
      attachEnvironment(id, environment);
    }); // Connect any new renderers that injected themselves.
  
    subs.push(hook.sub('environment', function (_ref2) {
      var id = _ref2.id,
          environment = _ref2.environment;
      attachEnvironment(id, environment);
    }));
    return function () {
      subs.forEach(function (fn) {
        return fn();
      });
    };
  }