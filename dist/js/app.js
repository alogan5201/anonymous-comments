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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ \"./node_modules/dompurify/dist/purify.js\");\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/database */ \"./node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picturefill */ \"./node_modules/picturefill/dist/picturefill.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(picturefill__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/errors */ \"./src/js/utils/errors.js\");\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(utils_errors__WEBPACK_IMPORTED_MODULE_5__);\n/** Variables available in all js files:\n * all the exported constants from globals.js\n */\n\n/** Directories available as aliases\n * all the paths within Dir in globals.js\n */\n\n\n\n\n\n\nlet url = window.location.href;\nvar firebaseConfig = {\n  apiKey: \"AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo\",\n  authDomain: \"geotools-bc75a.firebaseapp.com\",\n  projectId: \"geotools-bc75a\",\n  storageBucket: \"geotools-bc75a.appspot.com\",\n  messagingSenderId: \"106157954659\",\n  appId: \"1:106157954659:web:3e189110236a2138438a56\",\n  measurementId: \"G-Z6GK19K3L0\"\n};\nconst app = Object(firebase_app__WEBPACK_IMPORTED_MODULE_1__[\"initializeApp\"])(firebaseConfig);\nconst auth = Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getAuth\"])(); // Get a reference to the database service\n\nconst googleProvider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"]();\nconst db = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"getDatabase\"])();\n\nif (location.hostname === \"localhost\") {\n  // Point to the RTDB emulator running on localhost.\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"connectAuthEmulator\"])(auth, \"http://localhost:9099\");\n}\n\nif (window.location.href.includes('login')) {\n  const App = function _App() {\n    return `\n\n       <div class=\"container w-100 h-100 position-relative ${_App.state.class}\" style=\"    min-width: 100vw !important;\n    min-height: 100vh !important; \">\n    <div class=\"spinner-container position-absolute top-50\n                left-50\" style= \"width: 100%; text-align: center\">\n\n       <div class=\"spinner-grow text-primary \" role=\"status\">\n                <span class=\"visually-hidden\">Loading...</span>\n            </div>\n\n    </div>\n\n        </div>\n\n\n    `;\n  };\n\n  App.state = {\n    loading: false,\n    class: 'd-none',\n    count: 0,\n    toggleState: () => {\n      setState(() => {\n        App.state.loading = App.state.loading ? false : true;\n      });\n    }\n  };\n\n  function toggleLoading() {\n    if (App.state.loading == true) {\n      App.state.loading = false;\n      App.state.class = 'd-none';\n    } else {\n      App.state.loading = true;\n      App.state.class = '';\n    }\n  }\n\n  ;\n  $('#google-sign-in').on('click', function (e) {\n    e.preventDefault();\n    $('main').addClass('d-none');\n    $('#spinner-box').removeClass('d-none');\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signInWithRedirect\"])(auth, googleProvider);\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getRedirectResult\"])(auth).then(result => {\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromResult(result);\n        const token = credential.accessToken;\n        const user = result.user;\n      }).catch(error => {\n        // Handle Errors here.\n        const errorCode = error.code;\n        const errorMessage = error.message; // The email of the user's account used.\n\n        const email = error.email; // The AuthCredential type that was used.\n\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromError(error); // ...\n      }).finally(() => {\n        window.location.replace(\"/\");\n      });\n    } else {\n      $('#spinner-box').addClass('d-none');\n      $('main').removeClass('d-none');\n      console.log(' signed out');\n    }\n  });\n  __webpack_require__.e(/*! import() | lazy-module.login */ \"lazy-module.login\").then(__webpack_require__.bind(null, /*! ./lazy-module */ \"./src/js/lazy-module.js\")).then(module => {\n    const login = module.default;\n    login();\n  });\n}\n\nwindow.addEventListener('DOMContentLoaded', event => {\n  $('#testBtn').on('click', function () {\n    var myModal = new bootstrap.Modal(document.getElementById('modalSignOut'));\n    myModal.toggle();\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      $(\"#sign-in-elm\").css(\"display\", \"none\");\n      $(\"#sign-out-elm\").css(\"display\", \"block\");\n    } else {\n      $(\"#sign-out-elm\").css(\"display\", \"none\");\n      $(\"#sign-in-elm\").css(\"display\", \"block\");\n    }\n  });\n  $('#sign-out').on('click', async function (e) {\n    e.preventDefault();\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signOut\"])(auth).then(() => {\n      var myModal = new bootstrap.Modal(document.getElementById('modalSignOut'));\n      myModal.toggle();\n    }).catch(error => {});\n  });\n  $('#user-btn').on('click', function (e) {\n    e.preventDefault();\n  }); // Movie Directory\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvaW5kZXguanM/N2JhNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVmFyaWFibGVzIGF2YWlsYWJsZSBpbiBhbGwganMgZmlsZXM6XG4gKiBhbGwgdGhlIGV4cG9ydGVkIGNvbnN0YW50cyBmcm9tIGdsb2JhbHMuanNcbiAqL1xuXG4vKiogRGlyZWN0b3JpZXMgYXZhaWxhYmxlIGFzIGFsaWFzZXNcbiAqIGFsbCB0aGUgcGF0aHMgd2l0aGluIERpciBpbiBnbG9iYWxzLmpzXG4gKi9cblxuaW1wb3J0IGRvbXB1cmlmeSBmcm9tICdkb21wdXJpZnknXG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSAnZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IGdldERhdGFiYXNlIH0gZnJvbSBcImZpcmViYXNlL2RhdGFiYXNlXCI7XG5pbXBvcnQgeyBnZXRBdXRoLCBzaWduSW5XaXRoUmVkaXJlY3QsIGdldFJlZGlyZWN0UmVzdWx0LCBzaWduT3V0LCBHb29nbGVBdXRoUHJvdmlkZXIsIG9uQXV0aFN0YXRlQ2hhbmdlZCwgY29ubmVjdEF1dGhFbXVsYXRvciB9IGZyb20gXCJmaXJlYmFzZS9hdXRoXCI7XG5cbmltcG9ydCAncGljdHVyZWZpbGwnXG5pbXBvcnQgJ3V0aWxzL2Vycm9ycydcblxuXG5cbmxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuXG4gdmFyIGZpcmViYXNlQ29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5QkNVOFJSeFYzcWFTeXhPZ2M0T2JTV21VaGxmbkpzWVRvXCIsXG4gIGF1dGhEb21haW46IFwiZ2VvdG9vbHMtYmM3NWEuZmlyZWJhc2VhcHAuY29tXCIsXG4gIHByb2plY3RJZDogXCJnZW90b29scy1iYzc1YVwiLFxuICBzdG9yYWdlQnVja2V0OiBcImdlb3Rvb2xzLWJjNzVhLmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjEwNjE1Nzk1NDY1OVwiLFxuICBhcHBJZDogXCIxOjEwNjE1Nzk1NDY1OTp3ZWI6M2UxODkxMTAyMzZhMjEzODQzOGE1NlwiLFxuICBtZWFzdXJlbWVudElkOiBcIkctWjZHSzE5SzNMMFwiXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGF1dGggPSBnZXRBdXRoKCk7XG4vLyBHZXQgYSByZWZlcmVuY2UgdG8gdGhlIGRhdGFiYXNlIHNlcnZpY2VcblxuY29uc3QgZ29vZ2xlUHJvdmlkZXIgPSBuZXcgR29vZ2xlQXV0aFByb3ZpZGVyKCk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbmlmIChsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIikge1xuICAvLyBQb2ludCB0byB0aGUgUlREQiBlbXVsYXRvciBydW5uaW5nIG9uIGxvY2FsaG9zdC5cbmNvbm5lY3RBdXRoRW11bGF0b3IoYXV0aCwgXCJodHRwOi8vbG9jYWxob3N0OjkwOTlcIik7XG59XG5cbmlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKCdsb2dpbicpICl7XG5cbiAgY29uc3QgQXBwID0gZnVuY3Rpb24gX0FwcCgpIHtcbiAgICByZXR1cm4gYFxuXG4gICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciB3LTEwMCBoLTEwMCBwb3NpdGlvbi1yZWxhdGl2ZSAke19BcHAuc3RhdGUuY2xhc3N9XCIgc3R5bGU9XCIgICAgbWluLXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xuICAgIG1pbi1oZWlnaHQ6IDEwMHZoICFpbXBvcnRhbnQ7IFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWNvbnRhaW5lciBwb3NpdGlvbi1hYnNvbHV0ZSB0b3AtNTBcbiAgICAgICAgICAgICAgICBsZWZ0LTUwXCIgc3R5bGU9IFwid2lkdGg6IDEwMCU7IHRleHQtYWxpZ246IGNlbnRlclwiPlxuXG4gICAgICAgPGRpdiBjbGFzcz1cInNwaW5uZXItZ3JvdyB0ZXh0LXByaW1hcnkgXCIgcm9sZT1cInN0YXR1c1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+TG9hZGluZy4uLjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG5cblxuICAgIGA7XG4gIH07XG4gIEFwcC5zdGF0ZSA9IHtcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjbGFzczogJ2Qtbm9uZScsXG4gICAgY291bnQ6IDAsXG4gICAgdG9nZ2xlU3RhdGU6ICgpID0+IHtcbiAgICAgIHNldFN0YXRlKCgpID0+IHtcbiAgICAgICAgQXBwLnN0YXRlLmxvYWRpbmcgID0gQXBwLnN0YXRlLmxvYWRpbmcgPyBmYWxzZSA6IHRydWVcblxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG5cblxuICBmdW5jdGlvbiB0b2dnbGVMb2FkaW5nKCkge1xuXG4gIGlmKCBBcHAuc3RhdGUubG9hZGluZyA9PSB0cnVlKXtcbiAgICBBcHAuc3RhdGUubG9hZGluZyA9IGZhbHNlO1xuICAgIEFwcC5zdGF0ZS5jbGFzcyA9ICdkLW5vbmUnXG5cbiAgfSBlbHNlIHtcbiAgICBBcHAuc3RhdGUubG9hZGluZyA9IHRydWVcbiAgICBBcHAuc3RhdGUuY2xhc3MgPSAnJ1xuXG4gIH1cblxuICB9O1xuXG5cblxuJCgnI2dvb2dsZS1zaWduLWluJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcblxuZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiQoJ21haW4nKS5hZGRDbGFzcygnZC1ub25lJylcblxuICAkKCcjc3Bpbm5lci1ib3gnKS5yZW1vdmVDbGFzcygnZC1ub25lJylcbnNpZ25JbldpdGhSZWRpcmVjdChhdXRoLCBnb29nbGVQcm92aWRlcik7XG59KTtcbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAgKHVzZXIpID0+IHtcblxuXG4gIGlmICh1c2VyKSB7XG5cblxuXG5cbiAgZ2V0UmVkaXJlY3RSZXN1bHQoYXV0aClcbiAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuXG4gICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbVJlc3VsdChyZXN1bHQpO1xuICAgIGNvbnN0IHRva2VuID0gY3JlZGVudGlhbC5hY2Nlc3NUb2tlbjtcbiAgICBjb25zdCB1c2VyID0gcmVzdWx0LnVzZXI7XG5cblxuXG5cbiAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgLy8gSGFuZGxlIEVycm9ycyBoZXJlLlxuICAgIGNvbnN0IGVycm9yQ29kZSA9IGVycm9yLmNvZGU7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IubWVzc2FnZTtcbiAgICAvLyBUaGUgZW1haWwgb2YgdGhlIHVzZXIncyBhY2NvdW50IHVzZWQuXG4gICAgY29uc3QgZW1haWwgPSBlcnJvci5lbWFpbDtcbiAgICAvLyBUaGUgQXV0aENyZWRlbnRpYWwgdHlwZSB0aGF0IHdhcyB1c2VkLlxuICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBHb29nbGVBdXRoUHJvdmlkZXIuY3JlZGVudGlhbEZyb21FcnJvcihlcnJvcik7XG4gICAgLy8gLi4uXG4gIH0pXG4gIC5maW5hbGx5KCgpID0+IHtcblxuXG4gICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCIvXCIpO1xuICB9KTtcbiAgfSBlbHNlIHtcblxuJCgnI3NwaW5uZXItYm94JykuYWRkQ2xhc3MoJ2Qtbm9uZScpXG4kKCdtYWluJykucmVtb3ZlQ2xhc3MoJ2Qtbm9uZScpXG4gICAgICBjb25zb2xlLmxvZygnIHNpZ25lZCBvdXQnKVxuICB9XG59KTtcblxuICAgICAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJsYXp5LW1vZHVsZS5sb2dpblwiICovICcuL2xhenktbW9kdWxlJykudGhlbihtb2R1bGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgbG9naW4gPSBtb2R1bGUuZGVmYXVsdFxuXG4gICAgICAgICAgICBsb2dpbigpXG4gICAgICAgIH0pXG59XG5cblxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoZXZlbnQpID0+IHtcbiQoJyN0ZXN0QnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgdmFyIG15TW9kYWwgPSBuZXcgYm9vdHN0cmFwLk1vZGFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFNpZ25PdXQnKSlcbiBteU1vZGFsLnRvZ2dsZSgpXG59KTtcblxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsICAodXNlcikgPT4ge1xuXG4gIGlmICh1c2VyKSB7XG5cbiAgJChcIiNzaWduLWluLWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgJChcIiNzaWduLW91dC1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuXG5cbiAgfSBlbHNlIHtcblxuXG4gICQoXCIjc2lnbi1vdXQtZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAkKFwiI3NpZ24taW4tZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcblxuXG5cblxuXG4gIH1cbn0pO1xuXG5cblxuJCgnI3NpZ24tb3V0Jykub24oJ2NsaWNrJywgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIHNpZ25PdXQoYXV0aCkudGhlbigoKSA9PiB7XG4gICAgdmFyIG15TW9kYWwgPSBuZXcgYm9vdHN0cmFwLk1vZGFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbFNpZ25PdXQnKSlcbiAgICBteU1vZGFsLnRvZ2dsZSgpXG59KS5jYXRjaCgoZXJyb3IpID0+IHtcblxufSk7XG5cblxuXG59KTtcblxuXG5cbiAgJCgnI3VzZXItYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfSk7XG5cblxuXG4vLyBNb3ZpZSBEaXJlY3RvcnlcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbn0pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFVQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBVEE7QUFDQTtBQWFBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBREE7QUFJQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBR0E7QUFHQTtBQUNBO0FBTUE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBSUE7QUFDQTtBQUNBO0FBaUJBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/index.js\n");

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