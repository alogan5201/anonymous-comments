/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"lazy-module.login":"lazy-module.login","login.lazy":"login.lazy"}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1,"vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ \"./node_modules/dompurify/dist/purify.js\");\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/database */ \"./node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picturefill */ \"./node_modules/picturefill/dist/picturefill.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(picturefill__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/errors */ \"./src/js/utils/errors.js\");\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(utils_errors__WEBPACK_IMPORTED_MODULE_5__);\n/** Variables available in all js files:\n * all the exported constants from globals.js\n */\n\n/** Directories available as aliases\n * all the paths within Dir in globals.js\n */\n\n\n\n\n\n\nlet url = window.location.href;\nvar firebaseConfig = {\n  apiKey: \"AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo\",\n  authDomain: \"geotools-bc75a.firebaseapp.com\",\n  projectId: \"geotools-bc75a\",\n  storageBucket: \"geotools-bc75a.appspot.com\",\n  messagingSenderId: \"106157954659\",\n  appId: \"1:106157954659:web:3e189110236a2138438a56\",\n  measurementId: \"G-Z6GK19K3L0\"\n};\nconst app = Object(firebase_app__WEBPACK_IMPORTED_MODULE_1__[\"initializeApp\"])(firebaseConfig);\nconst auth = Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getAuth\"])(); // Get a reference to the database service\n\nconst googleProvider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"]();\n/*\nif (location.hostname === \"localhost\") {\n  // Point to the RTDB emulator running on localhost.\nconnectAuthEmulator(auth, \"http://localhost:9099\");\n}\n*/\n\nif (window.location.href.includes(\"login\")) {\n  const App = function _App() {\n    return `\n\n       <div class=\"container w-100 h-100 position-relative ${_App.state.class}\" style=\"    min-width: 100vw !important;\n    min-height: 100vh !important; \">\n    <div class=\"spinner-container position-absolute top-50\n                left-50\" style= \"width: 100%; text-align: center\">\n\n       <div class=\"spinner-grow text-primary \" role=\"status\">\n                <span class=\"visually-hidden\">Loading...</span>\n            </div>\n\n    </div>\n\n        </div>\n\n\n    `;\n  };\n\n  App.state = {\n    loading: false,\n    class: \"d-none\",\n    count: 0,\n    toggleState: () => {\n      setState(() => {\n        App.state.loading = App.state.loading ? false : true;\n      });\n    }\n  };\n\n  function toggleLoading() {\n    if (App.state.loading == true) {\n      App.state.loading = false;\n      App.state.class = \"d-none\";\n    } else {\n      App.state.loading = true;\n      App.state.class = \"\";\n    }\n  }\n\n  $(\"#google-sign-in\").on(\"click\", function (e) {\n    e.preventDefault();\n    $(\"main\").addClass(\"d-none\");\n    $(\"#spinner-box\").removeClass(\"d-none\");\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signInWithRedirect\"])(auth, googleProvider);\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getRedirectResult\"])(auth).then(result => {\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromResult(result);\n        const token = credential.accessToken;\n        const user = result.user;\n      }).catch(error => {\n        // Handle Errors here.\n        const errorCode = error.code;\n        const errorMessage = error.message; // The email of the user's account used.\n\n        const email = error.email; // The AuthCredential type that was used.\n\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromError(error); // ...\n      }).finally(() => {\n        window.location.replace(\"/\");\n      });\n    } else {\n      $(\"#spinner-box\").addClass(\"d-none\");\n      $(\"main\").removeClass(\"d-none\");\n      console.log(\" signed out\");\n    }\n  });\n  __webpack_require__.e(/*! import() | lazy-module.login */ \"lazy-module.login\").then(__webpack_require__.bind(null, /*! ./lazy-module */ \"./src/js/lazy-module.js\")).then(module => {\n    const login = module.default;\n    login();\n  });\n}\n\nwindow.addEventListener(\"DOMContentLoaded\", event => {\n  const db = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"getDatabase\"])();\n\n  if (document.getElementById(\"comment-form\")) {\n    const messageRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages/');\n    Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"onValue\"])(messageRef, snapshot => {\n      const data = snapshot.val();\n      console.log(data);\n\n      for (const key in data) {}\n    });\n    $(\"#comment-form\").on(\"submit\", function (e) {\n      e.preventDefault();\n      $(\"#comment-btn\").disabled = true;\n      let name = e.currentTarget[0].value;\n      let message = e.currentTarget[1].value;\n      let commentSection = document.getElementById(\"comment-section\");\n\n      function writeUserData(userId, name, email, imageUrl) {}\n\n      if (name && message) {\n        $(\"#comment-section\").append(`<div class=\"d-flex\">\n\n          <div class=\"ms-3\">\n            <div class=\"fw-bold\">${name}</div>\n            ${message}\n          </div>\n        </div>`);\n        const postListRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages');\n        const newPostRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"push\"])(postListRef);\n        Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"set\"])(newPostRef, {\n          name: name,\n          message: message\n        });\n      }\n\n      console.log(name, message);\n    });\n  }\n\n  $(\"#testBtn\").on(\"click\", function () {\n    var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n    myModal.toggle();\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      $(\"#sign-in-elm\").css(\"display\", \"none\");\n      $(\"#sign-out-elm\").css(\"display\", \"block\");\n    } else {\n      $(\"#sign-out-elm\").css(\"display\", \"none\");\n      $(\"#sign-in-elm\").css(\"display\", \"block\");\n    }\n  });\n  $(\"#sign-out\").on(\"click\", async function (e) {\n    e.preventDefault();\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signOut\"])(auth).then(() => {\n      var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n      myModal.toggle();\n    }).catch(error => {});\n  });\n  $(\"#user-btn\").on(\"click\", function (e) {\n    e.preventDefault();\n  }); // Movie Directory\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvaW5kZXguanM/N2JhNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVmFyaWFibGVzIGF2YWlsYWJsZSBpbiBhbGwganMgZmlsZXM6XG4gKiBhbGwgdGhlIGV4cG9ydGVkIGNvbnN0YW50cyBmcm9tIGdsb2JhbHMuanNcbiAqL1xuXG4vKiogRGlyZWN0b3JpZXMgYXZhaWxhYmxlIGFzIGFsaWFzZXNcbiAqIGFsbCB0aGUgcGF0aHMgd2l0aGluIERpciBpbiBnbG9iYWxzLmpzXG4gKi9cblxuaW1wb3J0IGRvbXB1cmlmeSBmcm9tIFwiZG9tcHVyaWZ5XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCAgb25WYWx1ZSwgcHVzaCB9IGZyb20gXCJmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5pbXBvcnQge1xuICBnZXRBdXRoLFxuICBzaWduSW5XaXRoUmVkaXJlY3QsXG4gIGdldFJlZGlyZWN0UmVzdWx0LFxuICBzaWduT3V0LFxuICBHb29nbGVBdXRoUHJvdmlkZXIsXG4gIG9uQXV0aFN0YXRlQ2hhbmdlZCxcbiAgY29ubmVjdEF1dGhFbXVsYXRvcixcbn0gZnJvbSBcImZpcmViYXNlL2F1dGhcIjtcblxuaW1wb3J0IFwicGljdHVyZWZpbGxcIjtcbmltcG9ydCBcInV0aWxzL2Vycm9yc1wiO1xubGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG52YXIgZmlyZWJhc2VDb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lCQ1U4UlJ4VjNxYVN5eE9nYzRPYlNXbVVobGZuSnNZVG9cIixcbiAgYXV0aERvbWFpbjogXCJnZW90b29scy1iYzc1YS5maXJlYmFzZWFwcC5jb21cIixcbiAgcHJvamVjdElkOiBcImdlb3Rvb2xzLWJjNzVhXCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiZ2VvdG9vbHMtYmM3NWEuYXBwc3BvdC5jb21cIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTA2MTU3OTU0NjU5XCIsXG4gIGFwcElkOiBcIjE6MTA2MTU3OTU0NjU5OndlYjozZTE4OTExMDIzNmEyMTM4NDM4YTU2XCIsXG4gIG1lYXN1cmVtZW50SWQ6IFwiRy1aNkdLMTlLM0wwXCIsXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGF1dGggPSBnZXRBdXRoKCk7XG4vLyBHZXQgYSByZWZlcmVuY2UgdG8gdGhlIGRhdGFiYXNlIHNlcnZpY2VcblxuY29uc3QgZ29vZ2xlUHJvdmlkZXIgPSBuZXcgR29vZ2xlQXV0aFByb3ZpZGVyKCk7XG5cbi8qXG5pZiAobG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIpIHtcbiAgLy8gUG9pbnQgdG8gdGhlIFJUREIgZW11bGF0b3IgcnVubmluZyBvbiBsb2NhbGhvc3QuXG5jb25uZWN0QXV0aEVtdWxhdG9yKGF1dGgsIFwiaHR0cDovL2xvY2FsaG9zdDo5MDk5XCIpO1xufVxuKi9cbmlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImxvZ2luXCIpKSB7XG4gIGNvbnN0IEFwcCA9IGZ1bmN0aW9uIF9BcHAoKSB7XG4gICAgcmV0dXJuIGBcblxuICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgdy0xMDAgaC0xMDAgcG9zaXRpb24tcmVsYXRpdmUgJHtfQXBwLnN0YXRlLmNsYXNzfVwiIHN0eWxlPVwiICAgIG1pbi13aWR0aDogMTAwdncgIWltcG9ydGFudDtcbiAgICBtaW4taGVpZ2h0OiAxMDB2aCAhaW1wb3J0YW50OyBcIj5cbiAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1jb250YWluZXIgcG9zaXRpb24tYWJzb2x1dGUgdG9wLTUwXG4gICAgICAgICAgICAgICAgbGVmdC01MFwiIHN0eWxlPSBcIndpZHRoOiAxMDAlOyB0ZXh0LWFsaWduOiBjZW50ZXJcIj5cblxuICAgICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWdyb3cgdGV4dC1wcmltYXJ5IFwiIHJvbGU9XCJzdGF0dXNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiPkxvYWRpbmcuLi48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuXG5cbiAgICBgO1xuICB9O1xuICBBcHAuc3RhdGUgPSB7XG4gICAgbG9hZGluZzogZmFsc2UsXG4gICAgY2xhc3M6IFwiZC1ub25lXCIsXG4gICAgY291bnQ6IDAsXG4gICAgdG9nZ2xlU3RhdGU6ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKCgpID0+IHtcbiAgICAgICAgQXBwLnN0YXRlLmxvYWRpbmcgPSBBcHAuc3RhdGUubG9hZGluZyA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG5cbiAgZnVuY3Rpb24gdG9nZ2xlTG9hZGluZygpIHtcbiAgICBpZiAoQXBwLnN0YXRlLmxvYWRpbmcgPT0gdHJ1ZSkge1xuICAgICAgQXBwLnN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIEFwcC5zdGF0ZS5jbGFzcyA9IFwiZC1ub25lXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIEFwcC5zdGF0ZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAgIEFwcC5zdGF0ZS5jbGFzcyA9IFwiXCI7XG4gICAgfVxuICB9XG5cbiAgJChcIiNnb29nbGUtc2lnbi1pblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgJChcIm1haW5cIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG5cbiAgICAkKFwiI3NwaW5uZXItYm94XCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgIHNpZ25JbldpdGhSZWRpcmVjdChhdXRoLCBnb29nbGVQcm92aWRlcik7XG4gIH0pO1xuICBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgKHVzZXIpID0+IHtcbiAgICBpZiAodXNlcikge1xuICAgICAgZ2V0UmVkaXJlY3RSZXN1bHQoYXV0aClcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBHb29nbGVBdXRoUHJvdmlkZXIuY3JlZGVudGlhbEZyb21SZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IGNyZWRlbnRpYWwuYWNjZXNzVG9rZW47XG4gICAgICAgICAgY29uc3QgdXNlciA9IHJlc3VsdC51c2VyO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgLy8gSGFuZGxlIEVycm9ycyBoZXJlLlxuICAgICAgICAgIGNvbnN0IGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG4gICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICAgICAvLyBUaGUgZW1haWwgb2YgdGhlIHVzZXIncyBhY2NvdW50IHVzZWQuXG4gICAgICAgICAgY29uc3QgZW1haWwgPSBlcnJvci5lbWFpbDtcbiAgICAgICAgICAvLyBUaGUgQXV0aENyZWRlbnRpYWwgdHlwZSB0aGF0IHdhcyB1c2VkLlxuICAgICAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBHb29nbGVBdXRoUHJvdmlkZXIuY3JlZGVudGlhbEZyb21FcnJvcihlcnJvcik7XG4gICAgICAgICAgLy8gLi4uXG4gICAgICAgIH0pXG4gICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShcIi9cIik7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI3NwaW5uZXItYm94XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgJChcIm1haW5cIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICBjb25zb2xlLmxvZyhcIiBzaWduZWQgb3V0XCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW1wb3J0KC8qIHdlYnBhY2tDaHVua05hbWU6IFwibGF6eS1tb2R1bGUubG9naW5cIiAqLyBcIi4vbGF6eS1tb2R1bGVcIikudGhlbihcbiAgICAobW9kdWxlKSA9PiB7XG4gICAgICBjb25zdCBsb2dpbiA9IG1vZHVsZS5kZWZhdWx0O1xuXG4gICAgICBsb2dpbigpO1xuICAgIH1cbiAgKTtcbn1cblxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgPT4ge1xuICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbiAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tbWVudC1mb3JtXCIpKXtcbiAgICBjb25zdCBtZXNzYWdlUmVmPSByZWYoZGIsICdtZXNzYWdlcy8nICApO1xuICAgIG9uVmFsdWUobWVzc2FnZVJlZiwgKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gY29uc29sZS5sb2coZGF0YSlcbiBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG5cbiB9XG4gICAgfSk7XG4gICAgJChcIiNjb21tZW50LWZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiQoXCIjY29tbWVudC1idG5cIikuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgbGV0IG5hbWUgPSBlLmN1cnJlbnRUYXJnZXRbMF0udmFsdWU7XG4gICAgICBsZXQgbWVzc2FnZSA9IGUuY3VycmVudFRhcmdldFsxXS52YWx1ZTtcbiAgICAgIGxldCBjb21tZW50U2VjdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tbWVudC1zZWN0aW9uXCIpXG4gICAgICBmdW5jdGlvbiB3cml0ZVVzZXJEYXRhKHVzZXJJZCwgbmFtZSwgZW1haWwsIGltYWdlVXJsKSB7XG5cblxuICAgICAgfVxuICAgICAgaWYobmFtZSAmJiBtZXNzYWdlKXtcbiAgICAgICAgJCggXCIjY29tbWVudC1zZWN0aW9uXCIgKS5hcHBlbmQoIGA8ZGl2IGNsYXNzPVwiZC1mbGV4XCI+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXMtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZ3LWJvbGRcIj4ke25hbWV9PC9kaXY+XG4gICAgICAgICAgICAke21lc3NhZ2V9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PmAgKTtcbiAgICAgICAgY29uc3QgcG9zdExpc3RSZWYgPSByZWYoZGIsICdtZXNzYWdlcycpO1xuICAgICAgICBjb25zdCBuZXdQb3N0UmVmID0gcHVzaChwb3N0TGlzdFJlZik7XG4gICAgICAgIHNldChuZXdQb3N0UmVmLCB7XG4gICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobmFtZSwgbWVzc2FnZSlcblxuICAgIH0pO1xuICB9XG4gICQoXCIjdGVzdEJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXlNb2RhbCA9IG5ldyBib290c3RyYXAuTW9kYWwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbFNpZ25PdXRcIikpO1xuICAgIG15TW9kYWwudG9nZ2xlKCk7XG4gIH0pO1xuXG4gIG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xuICAgIGlmICh1c2VyKSB7XG4gICAgICAkKFwiI3NpZ24taW4tZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgJChcIiNzaWduLW91dC1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI3NpZ24tb3V0LWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICQoXCIjc2lnbi1pbi1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgIH1cbiAgfSk7XG5cbiAgJChcIiNzaWduLW91dFwiKS5vbihcImNsaWNrXCIsIGFzeW5jIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHNpZ25PdXQoYXV0aClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdmFyIG15TW9kYWwgPSBuZXcgYm9vdHN0cmFwLk1vZGFsKFxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kYWxTaWduT3V0XCIpXG4gICAgICAgICk7XG4gICAgICAgIG15TW9kYWwudG9nZ2xlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge30pO1xuICB9KTtcblxuICAkKFwiI3VzZXItYnRuXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIC8vIE1vdmllIERpcmVjdG9yeVxufSk7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQVVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/index.js\n");

/***/ }),

/***/ "./src/js/utils/errors.js":
/*!********************************!*\
  !*** ./src/js/utils/errors.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Avoid `console` errors in browsers that lack a console.\n(function () {\n  var method;\n\n  var noop = function () {};\n\n  var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'];\n  var length = methods.length;\n  var console = window.console = window.console || {};\n\n  while (length--) {\n    method = methods[length]; // Only stub undefined methods.\n\n    if (!console[method]) {\n      console[method] = noop;\n    }\n  }\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvdXRpbHMvZXJyb3JzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3V0aWxzL2Vycm9ycy5qcz80YjlmIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEF2b2lkIGBjb25zb2xlYCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBsYWNrIGEgY29uc29sZS5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRob2Q7XG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG4gIHZhciBtZXRob2RzID0gW1xuICAgICdhc3NlcnQnLCAnY2xlYXInLCAnY291bnQnLCAnZGVidWcnLCAnZGlyJywgJ2RpcnhtbCcsICdlcnJvcicsXG4gICAgJ2V4Y2VwdGlvbicsICdncm91cCcsICdncm91cENvbGxhcHNlZCcsICdncm91cEVuZCcsICdpbmZvJywgJ2xvZycsXG4gICAgJ21hcmtUaW1lbGluZScsICdwcm9maWxlJywgJ3Byb2ZpbGVFbmQnLCAndGFibGUnLCAndGltZScsICd0aW1lRW5kJyxcbiAgICAndGltZWxpbmUnLCAndGltZWxpbmVFbmQnLCAndGltZVN0YW1wJywgJ3RyYWNlJywgJ3dhcm4nXG4gIF07XG4gIHZhciBsZW5ndGggPSBtZXRob2RzLmxlbmd0aDtcbiAgdmFyIGNvbnNvbGUgPSAod2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7fSk7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgbWV0aG9kID0gbWV0aG9kc1tsZW5ndGhdO1xuXG4gICAgLy8gT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxuICAgIGlmICghY29uc29sZVttZXRob2RdKSB7XG4gICAgICBjb25zb2xlW21ldGhvZF0gPSBub29wO1xuICAgIH1cbiAgfVxufSgpKTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/utils/errors.js\n");

/***/ }),

/***/ 1:
/*!*******************************!*\
  !*** multi ./src/js/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/index.js */"./src/js/index.js");


/***/ })

/******/ });