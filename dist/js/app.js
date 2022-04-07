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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ \"./node_modules/dompurify/dist/purify.js\");\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/database */ \"./node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picturefill */ \"./node_modules/picturefill/dist/picturefill.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(picturefill__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/errors */ \"./src/js/utils/errors.js\");\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(utils_errors__WEBPACK_IMPORTED_MODULE_5__);\n/** Variables available in all js files:\n * all the exported constants from globals.js\n */\n\n/** Directories available as aliases\n * all the paths within Dir in globals.js\n */\n\n\n\n\n\n\nlet url = window.location.href;\nvar firebaseConfig = {\n  apiKey: \"AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo\",\n  authDomain: \"geotools-bc75a.firebaseapp.com\",\n  projectId: \"geotools-bc75a\",\n  storageBucket: \"geotools-bc75a.appspot.com\",\n  messagingSenderId: \"106157954659\",\n  appId: \"1:106157954659:web:3e189110236a2138438a56\",\n  measurementId: \"G-Z6GK19K3L0\"\n};\nconst app = Object(firebase_app__WEBPACK_IMPORTED_MODULE_1__[\"initializeApp\"])(firebaseConfig);\nconst auth = Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getAuth\"])(); // Get a reference to the database service\n\nconst googleProvider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"]();\nconst db = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"getDatabase\"])();\n/*\nif (location.hostname === \"localhost\") {\n  // Point to the RTDB emulator running on localhost.\nconnectAuthEmulator(auth, \"http://localhost:9099\");\n}\n*/\n\nif (window.location.href.includes(\"login\")) {\n  const App = function _App() {\n    return `\n\n       <div class=\"container w-100 h-100 position-relative ${_App.state.class}\" style=\"    min-width: 100vw !important;\n    min-height: 100vh !important; \">\n    <div class=\"spinner-container position-absolute top-50\n                left-50\" style= \"width: 100%; text-align: center\">\n\n       <div class=\"spinner-grow text-primary \" role=\"status\">\n                <span class=\"visually-hidden\">Loading...</span>\n            </div>\n\n    </div>\n\n        </div>\n\n\n    `;\n  };\n\n  App.state = {\n    loading: false,\n    class: \"d-none\",\n    count: 0,\n    toggleState: () => {\n      setState(() => {\n        App.state.loading = App.state.loading ? false : true;\n      });\n    }\n  };\n\n  function toggleLoading() {\n    if (App.state.loading == true) {\n      App.state.loading = false;\n      App.state.class = \"d-none\";\n    } else {\n      App.state.loading = true;\n      App.state.class = \"\";\n    }\n  }\n\n  $(\"#google-sign-in\").on(\"click\", function (e) {\n    e.preventDefault();\n    $(\"main\").addClass(\"d-none\");\n    $(\"#spinner-box\").removeClass(\"d-none\");\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signInWithRedirect\"])(auth, googleProvider);\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getRedirectResult\"])(auth).then(result => {\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromResult(result);\n        const token = credential.accessToken;\n        const user = result.user;\n      }).catch(error => {\n        // Handle Errors here.\n        const errorCode = error.code;\n        const errorMessage = error.message; // The email of the user's account used.\n\n        const email = error.email; // The AuthCredential type that was used.\n\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromError(error); // ...\n      }).finally(() => {\n        window.location.replace(\"/\");\n      });\n    } else {\n      $(\"#spinner-box\").addClass(\"d-none\");\n      $(\"main\").removeClass(\"d-none\");\n      console.log(\" signed out\");\n    }\n  });\n  __webpack_require__.e(/*! import() | lazy-module.login */ \"lazy-module.login\").then(__webpack_require__.bind(null, /*! ./lazy-module */ \"./src/js/lazy-module.js\")).then(module => {\n    const login = module.default;\n    login();\n  });\n}\n\nif ($('body').hasClass('film-location')) {\n  let map = L.map('map');\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {\n    foo: 'bar',\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>'\n  }).addTo(map);\n  map.setView([0, 0], 5);\n\n  function extractData() {\n    let table = document.querySelector('.table');\n    const results = [];\n\n    for (let index = 1; index < table.rows.length; index++) {\n      const row = table.rows[index];\n      let location = row.cells[0].innerText;\n      let coordinates = row.cells[1];\n      let lat = coordinates.firstElementChild.innerText;\n      let lon = coordinates.lastElementChild.innerText;\n      console.log(lat, lon);\n      /*if (coordinates.length > 1 ){\n      let parsedCoords = coordinates.replace(/[\\(\\)]/g,'').split(',');\n      parsedCoords[0] = parseFloat(parsedCoords[0])\n      parsedCoords[1] = parseFloat(parsedCoords[1])\n       // console.log(parsedCoords)\n       let obj = {\"location\": location, \"coordinates\":parsedCoords}\n      results.push(obj)\n       }\n      else {\n        console.log('NaN')\n      }*/\n    }\n  }\n\n  extractData();\n}\n\n;\nwindow.addEventListener(\"DOMContentLoaded\", event => {\n  $(\"#testBtn\").on(\"click\", function () {\n    var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n    myModal.toggle();\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      $(\"#sign-in-elm\").css(\"display\", \"none\");\n      $(\"#sign-out-elm\").css(\"display\", \"block\");\n    } else {\n      $(\"#sign-out-elm\").css(\"display\", \"none\");\n      $(\"#sign-in-elm\").css(\"display\", \"block\");\n    }\n  });\n  $(\"#sign-out\").on(\"click\", async function (e) {\n    e.preventDefault();\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signOut\"])(auth).then(() => {\n      var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n      myModal.toggle();\n    }).catch(error => {});\n  });\n  $(\"#user-btn\").on(\"click\", function (e) {\n    e.preventDefault();\n  }); // Movie Directory\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvaW5kZXguanM/N2JhNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVmFyaWFibGVzIGF2YWlsYWJsZSBpbiBhbGwganMgZmlsZXM6XG4gKiBhbGwgdGhlIGV4cG9ydGVkIGNvbnN0YW50cyBmcm9tIGdsb2JhbHMuanNcbiAqL1xuXG4vKiogRGlyZWN0b3JpZXMgYXZhaWxhYmxlIGFzIGFsaWFzZXNcbiAqIGFsbCB0aGUgcGF0aHMgd2l0aGluIERpciBpbiBnbG9iYWxzLmpzXG4gKi9cblxuaW1wb3J0IGRvbXB1cmlmeSBmcm9tIFwiZG9tcHVyaWZ5XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UgfSBmcm9tIFwiZmlyZWJhc2UvZGF0YWJhc2VcIjtcbmltcG9ydCB7XG4gIGdldEF1dGgsXG4gIHNpZ25JbldpdGhSZWRpcmVjdCxcbiAgZ2V0UmVkaXJlY3RSZXN1bHQsXG4gIHNpZ25PdXQsXG4gIEdvb2dsZUF1dGhQcm92aWRlcixcbiAgb25BdXRoU3RhdGVDaGFuZ2VkLFxuICBjb25uZWN0QXV0aEVtdWxhdG9yLFxufSBmcm9tIFwiZmlyZWJhc2UvYXV0aFwiO1xuXG5pbXBvcnQgXCJwaWN0dXJlZmlsbFwiO1xuaW1wb3J0IFwidXRpbHMvZXJyb3JzXCI7XG5cbmxldCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxudmFyIGZpcmViYXNlQ29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5QkNVOFJSeFYzcWFTeXhPZ2M0T2JTV21VaGxmbkpzWVRvXCIsXG4gIGF1dGhEb21haW46IFwiZ2VvdG9vbHMtYmM3NWEuZmlyZWJhc2VhcHAuY29tXCIsXG4gIHByb2plY3RJZDogXCJnZW90b29scy1iYzc1YVwiLFxuICBzdG9yYWdlQnVja2V0OiBcImdlb3Rvb2xzLWJjNzVhLmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjEwNjE1Nzk1NDY1OVwiLFxuICBhcHBJZDogXCIxOjEwNjE1Nzk1NDY1OTp3ZWI6M2UxODkxMTAyMzZhMjEzODQzOGE1NlwiLFxuICBtZWFzdXJlbWVudElkOiBcIkctWjZHSzE5SzNMMFwiLFxufTtcblxuY29uc3QgYXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG5jb25zdCBhdXRoID0gZ2V0QXV0aCgpO1xuLy8gR2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBkYXRhYmFzZSBzZXJ2aWNlXG5cbmNvbnN0IGdvb2dsZVByb3ZpZGVyID0gbmV3IEdvb2dsZUF1dGhQcm92aWRlcigpO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuLypcbmlmIChsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIikge1xuICAvLyBQb2ludCB0byB0aGUgUlREQiBlbXVsYXRvciBydW5uaW5nIG9uIGxvY2FsaG9zdC5cbmNvbm5lY3RBdXRoRW11bGF0b3IoYXV0aCwgXCJodHRwOi8vbG9jYWxob3N0OjkwOTlcIik7XG59XG4qL1xuaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwibG9naW5cIikpIHtcbiAgY29uc3QgQXBwID0gZnVuY3Rpb24gX0FwcCgpIHtcbiAgICByZXR1cm4gYFxuXG4gICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciB3LTEwMCBoLTEwMCBwb3NpdGlvbi1yZWxhdGl2ZSAke19BcHAuc3RhdGUuY2xhc3N9XCIgc3R5bGU9XCIgICAgbWluLXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xuICAgIG1pbi1oZWlnaHQ6IDEwMHZoICFpbXBvcnRhbnQ7IFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWNvbnRhaW5lciBwb3NpdGlvbi1hYnNvbHV0ZSB0b3AtNTBcbiAgICAgICAgICAgICAgICBsZWZ0LTUwXCIgc3R5bGU9IFwid2lkdGg6IDEwMCU7IHRleHQtYWxpZ246IGNlbnRlclwiPlxuXG4gICAgICAgPGRpdiBjbGFzcz1cInNwaW5uZXItZ3JvdyB0ZXh0LXByaW1hcnkgXCIgcm9sZT1cInN0YXR1c1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+TG9hZGluZy4uLjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG5cblxuICAgIGA7XG4gIH07XG4gIEFwcC5zdGF0ZSA9IHtcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjbGFzczogXCJkLW5vbmVcIixcbiAgICBjb3VudDogMCxcbiAgICB0b2dnbGVTdGF0ZTogKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoKCkgPT4ge1xuICAgICAgICBBcHAuc3RhdGUubG9hZGluZyA9IEFwcC5zdGF0ZS5sb2FkaW5nID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcblxuICBmdW5jdGlvbiB0b2dnbGVMb2FkaW5nKCkge1xuICAgIGlmIChBcHAuc3RhdGUubG9hZGluZyA9PSB0cnVlKSB7XG4gICAgICBBcHAuc3RhdGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgQXBwLnN0YXRlLmNsYXNzID0gXCJkLW5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgQXBwLnN0YXRlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgQXBwLnN0YXRlLmNsYXNzID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICAkKFwiI2dvb2dsZS1zaWduLWluXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKFwibWFpblwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcblxuICAgICQoXCIjc3Bpbm5lci1ib3hcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgc2lnbkluV2l0aFJlZGlyZWN0KGF1dGgsIGdvb2dsZVByb3ZpZGVyKTtcbiAgfSk7XG4gIG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBnZXRSZWRpcmVjdFJlc3VsdChhdXRoKVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gY3JlZGVudGlhbC5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICBjb25zdCB1c2VyID0gcmVzdWx0LnVzZXI7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JzIGhlcmUuXG4gICAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gZXJyb3IuY29kZTtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIC8vIFRoZSBlbWFpbCBvZiB0aGUgdXNlcidzIGFjY291bnQgdXNlZC5cbiAgICAgICAgICBjb25zdCBlbWFpbCA9IGVycm9yLmVtYWlsO1xuICAgICAgICAgIC8vIFRoZSBBdXRoQ3JlZGVudGlhbCB0eXBlIHRoYXQgd2FzIHVzZWQuXG4gICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbUVycm9yKGVycm9yKTtcbiAgICAgICAgICAvLyAuLi5cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiL1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoXCIjc3Bpbm5lci1ib3hcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkKFwibWFpblwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiIHNpZ25lZCBvdXRcIik7XG4gICAgfVxuICB9KTtcblxuICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJsYXp5LW1vZHVsZS5sb2dpblwiICovIFwiLi9sYXp5LW1vZHVsZVwiKS50aGVuKFxuICAgIChtb2R1bGUpID0+IHtcbiAgICAgIGNvbnN0IGxvZ2luID0gbW9kdWxlLmRlZmF1bHQ7XG5cbiAgICAgIGxvZ2luKCk7XG4gICAgfVxuICApO1xufVxuXG5cbmlmKCQoJ2JvZHknKS5oYXNDbGFzcygnZmlsbS1sb2NhdGlvbicpKXtcblxuXG4gbGV0IG1hcCA9IEwubWFwKCdtYXAnKTtcbkwudGlsZUxheWVyKCdodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZz97Zm9vfScsIHtcbiAgICAgICAgICAgIGZvbzogJ2JhcicsXG4gICAgICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4nXG4gICAgICAgIH0pLmFkZFRvKG1hcCk7XG4gICAgICAgIG1hcC5zZXRWaWV3KFswLCAwXSwgNSk7XG5cbiAgICAgICAgICAgZnVuY3Rpb24gZXh0cmFjdERhdGEgKCkge1xuICBsZXQgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGUnKVxuXG4gIGNvbnN0IHJlc3VsdHMgPSBbXVxuIGZvciAobGV0IGluZGV4ID0gMTsgaW5kZXggPCB0YWJsZS5yb3dzLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gIGNvbnN0IHJvdyA9IHRhYmxlLnJvd3NbaW5kZXhdO1xuICBsZXQgbG9jYXRpb24gPSByb3cuY2VsbHNbMF0uaW5uZXJUZXh0XG4gIGxldCBjb29yZGluYXRlcyA9IHJvdy5jZWxsc1sxXVxuICBsZXQgbGF0ID0gY29vcmRpbmF0ZXMuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJUZXh0XG4gIGxldCBsb24gPSBjb29yZGluYXRlcy5sYXN0RWxlbWVudENoaWxkLmlubmVyVGV4dFxuICBjb25zb2xlLmxvZyhsYXQsIGxvbilcbiAgLyppZiAoY29vcmRpbmF0ZXMubGVuZ3RoID4gMSApe1xuXG4gbGV0IHBhcnNlZENvb3JkcyA9IGNvb3JkaW5hdGVzLnJlcGxhY2UoL1tcXChcXCldL2csJycpLnNwbGl0KCcsJyk7XG4gIHBhcnNlZENvb3Jkc1swXSA9IHBhcnNlRmxvYXQocGFyc2VkQ29vcmRzWzBdKVxuICBwYXJzZWRDb29yZHNbMV0gPSBwYXJzZUZsb2F0KHBhcnNlZENvb3Jkc1sxXSlcbiAgIC8vIGNvbnNvbGUubG9nKHBhcnNlZENvb3JkcylcblxuICBsZXQgb2JqID0ge1wibG9jYXRpb25cIjogbG9jYXRpb24sIFwiY29vcmRpbmF0ZXNcIjpwYXJzZWRDb29yZHN9XG4gIHJlc3VsdHMucHVzaChvYmopXG5cbiAgfVxuICBlbHNlIHtcbiAgICBjb25zb2xlLmxvZygnTmFOJylcbiAgfSovXG5cblxuXG59XG5cblxufVxuZXh0cmFjdERhdGEoKVxuXG59O1xuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgPT4ge1xuICAkKFwiI3Rlc3RCdG5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG15TW9kYWwgPSBuZXcgYm9vdHN0cmFwLk1vZGFsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kYWxTaWduT3V0XCIpKTtcbiAgICBteU1vZGFsLnRvZ2dsZSgpO1xuICB9KTtcblxuICBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgKHVzZXIpID0+IHtcbiAgICBpZiAodXNlcikge1xuICAgICAgJChcIiNzaWduLWluLWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICQoXCIjc2lnbi1vdXQtZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNzaWduLW91dC1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAkKFwiI3NpZ24taW4tZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gICQoXCIjc2lnbi1vdXRcIikub24oXCJjbGlja1wiLCBhc3luYyBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBzaWduT3V0KGF1dGgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHZhciBteU1vZGFsID0gbmV3IGJvb3RzdHJhcC5Nb2RhbChcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGFsU2lnbk91dFwiKVxuICAgICAgICApO1xuICAgICAgICBteU1vZGFsLnRvZ2dsZSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHt9KTtcbiAgfSk7XG5cbiAgJChcIiN1c2VyLWJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcblxuICAvLyBNb3ZpZSBEaXJlY3Rvcnlcbn0pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFVQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFVQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFHQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBREE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFHQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/index.js\n");

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