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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ \"./node_modules/dompurify/dist/purify.js\");\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/database */ \"./node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picturefill */ \"./node_modules/picturefill/dist/picturefill.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(picturefill__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/errors */ \"./src/js/utils/errors.js\");\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(utils_errors__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var geolib_es_orderByDistance__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! geolib/es/orderByDistance */ \"./node_modules/geolib/es/orderByDistance.js\");\n/* harmony import */ var geolib_es_orderByDistance__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(geolib_es_orderByDistance__WEBPACK_IMPORTED_MODULE_6__);\n/** Variables available in all js files:\n * all the exported constants from globals.js\n */\n\n/** Directories available as aliases\n * all the paths within Dir in globals.js\n */\n\n\n\n\n\n\n\nlet url = window.location.href;\nvar firebaseConfig = {\n  apiKey: \"AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo\",\n  authDomain: \"geotools-bc75a.firebaseapp.com\",\n  projectId: \"geotools-bc75a\",\n  storageBucket: \"geotools-bc75a.appspot.com\",\n  messagingSenderId: \"106157954659\",\n  appId: \"1:106157954659:web:3e189110236a2138438a56\",\n  measurementId: \"G-Z6GK19K3L0\"\n};\nconst app = Object(firebase_app__WEBPACK_IMPORTED_MODULE_1__[\"initializeApp\"])(firebaseConfig);\nconst auth = Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getAuth\"])(); // Get a reference to the database service\n\nconst googleProvider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"]();\nconst db = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"getDatabase\"])();\n/*\nif (location.hostname === \"localhost\") {\n  // Point to the RTDB emulator running on localhost.\nconnectAuthEmulator(auth, \"http://localhost:9099\");\n}\n*/\n\nif (window.location.href.includes(\"login\")) {\n  const App = function _App() {\n    return `\n\n       <div class=\"container w-100 h-100 position-relative ${_App.state.class}\" style=\"    min-width: 100vw !important;\n    min-height: 100vh !important; \">\n    <div class=\"spinner-container position-absolute top-50\n                left-50\" style= \"width: 100%; text-align: center\">\n\n       <div class=\"spinner-grow text-primary \" role=\"status\">\n                <span class=\"visually-hidden\">Loading...</span>\n            </div>\n\n    </div>\n\n        </div>\n\n\n    `;\n  };\n\n  App.state = {\n    loading: false,\n    class: \"d-none\",\n    count: 0,\n    toggleState: () => {\n      setState(() => {\n        App.state.loading = App.state.loading ? false : true;\n      });\n    }\n  };\n\n  function toggleLoading() {\n    if (App.state.loading == true) {\n      App.state.loading = false;\n      App.state.class = \"d-none\";\n    } else {\n      App.state.loading = true;\n      App.state.class = \"\";\n    }\n  }\n\n  $(\"#google-sign-in\").on(\"click\", function (e) {\n    e.preventDefault();\n    $(\"main\").addClass(\"d-none\");\n    $(\"#spinner-box\").removeClass(\"d-none\");\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signInWithRedirect\"])(auth, googleProvider);\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getRedirectResult\"])(auth).then(result => {\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromResult(result);\n        const token = credential.accessToken;\n        const user = result.user;\n      }).catch(error => {\n        // Handle Errors here.\n        const errorCode = error.code;\n        const errorMessage = error.message; // The email of the user's account used.\n\n        const email = error.email; // The AuthCredential type that was used.\n\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromError(error); // ...\n      }).finally(() => {\n        window.location.replace(\"/\");\n      });\n    } else {\n      $(\"#spinner-box\").addClass(\"d-none\");\n      $(\"main\").removeClass(\"d-none\");\n      console.log(\" signed out\");\n    }\n  });\n  __webpack_require__.e(/*! import() | lazy-module.login */ \"lazy-module.login\").then(__webpack_require__.bind(null, /*! ./lazy-module */ \"./src/js/lazy-module.js\")).then(module => {\n    const login = module.default;\n    login();\n  });\n}\n\nif ($('body').hasClass('film-location')) {\n  let map = L.map('map').setView([0, 0], 5);\n  ;\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {\n    foo: 'bar',\n    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>'\n  }).addTo(map);\n\n  function extractData() {\n    let table = document.querySelector('.table');\n    const results = [];\n    const markers = [];\n    const allcoords = [];\n\n    for (let index = 1; index < table.rows.length; index++) {\n      const row = table.rows[index];\n      let location = row.cells[0].innerText;\n      let coordinates = row.cells[1];\n      let lat = coordinates.firstElementChild.innerText;\n      let lon = coordinates.lastElementChild.innerText;\n      let coords = [lat, lon];\n      allcoords.push(coords);\n      let marker = L.marker([lat, lon]);\n      marker.bindPopup(location);\n      marker.addTo(map);\n      /*\n      if (index < 4){\n      markers.push([lat,lon])\n      let marker = L.marker([lat, lon]);\n      marker.bindPopup(location);\n      marker.addTo(map);\n      }\n      else {\n        // /console.log(lat, lon)\n      let marker = L.marker([lat, lon]);\n      marker.bindPopup(location);\n      marker.addTo(map);\n      }*/\n    } //console.log(allcoords)\n\n\n    const firstC = allcoords[0];\n    const ordered = geolib_es_orderByDistance__WEBPACK_IMPORTED_MODULE_6___default()(firstC, allcoords); //console.log(ordered)\n\n    if (ordered.length > 3) {\n      let newArr = ordered.slice(0, 3);\n      console.log(newArr);\n      map.fitBounds([newArr]);\n      map.zoomOut(5);\n    } else if (ordered.length < 3) {\n      map.fitBounds([ordered]);\n      map.zoomOut(5);\n    } //map.fitBounds(result)\n\n  }\n\n  extractData();\n}\n\n;\nwindow.addEventListener(\"DOMContentLoaded\", event => {\n  $(\"#testBtn\").on(\"click\", function () {\n    var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n    myModal.toggle();\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      $(\"#sign-in-elm\").css(\"display\", \"none\");\n      $(\"#sign-out-elm\").css(\"display\", \"block\");\n    } else {\n      $(\"#sign-out-elm\").css(\"display\", \"none\");\n      $(\"#sign-in-elm\").css(\"display\", \"block\");\n    }\n  });\n  $(\"#sign-out\").on(\"click\", async function (e) {\n    e.preventDefault();\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signOut\"])(auth).then(() => {\n      var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n      myModal.toggle();\n    }).catch(error => {});\n  });\n  $(\"#user-btn\").on(\"click\", function (e) {\n    e.preventDefault();\n  }); // Movie Directory\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvaW5kZXguanM/N2JhNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVmFyaWFibGVzIGF2YWlsYWJsZSBpbiBhbGwganMgZmlsZXM6XG4gKiBhbGwgdGhlIGV4cG9ydGVkIGNvbnN0YW50cyBmcm9tIGdsb2JhbHMuanNcbiAqL1xuXG4vKiogRGlyZWN0b3JpZXMgYXZhaWxhYmxlIGFzIGFsaWFzZXNcbiAqIGFsbCB0aGUgcGF0aHMgd2l0aGluIERpciBpbiBnbG9iYWxzLmpzXG4gKi9cblxuaW1wb3J0IGRvbXB1cmlmeSBmcm9tIFwiZG9tcHVyaWZ5XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UgfSBmcm9tIFwiZmlyZWJhc2UvZGF0YWJhc2VcIjtcbmltcG9ydCB7XG4gIGdldEF1dGgsXG4gIHNpZ25JbldpdGhSZWRpcmVjdCxcbiAgZ2V0UmVkaXJlY3RSZXN1bHQsXG4gIHNpZ25PdXQsXG4gIEdvb2dsZUF1dGhQcm92aWRlcixcbiAgb25BdXRoU3RhdGVDaGFuZ2VkLFxuICBjb25uZWN0QXV0aEVtdWxhdG9yLFxufSBmcm9tIFwiZmlyZWJhc2UvYXV0aFwiO1xuXG5pbXBvcnQgXCJwaWN0dXJlZmlsbFwiO1xuaW1wb3J0IFwidXRpbHMvZXJyb3JzXCI7XG5pbXBvcnQgb3JkZXJCeURpc3RhbmNlIGZyb20gJ2dlb2xpYi9lcy9vcmRlckJ5RGlzdGFuY2UnO1xubGV0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG52YXIgZmlyZWJhc2VDb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lCQ1U4UlJ4VjNxYVN5eE9nYzRPYlNXbVVobGZuSnNZVG9cIixcbiAgYXV0aERvbWFpbjogXCJnZW90b29scy1iYzc1YS5maXJlYmFzZWFwcC5jb21cIixcbiAgcHJvamVjdElkOiBcImdlb3Rvb2xzLWJjNzVhXCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiZ2VvdG9vbHMtYmM3NWEuYXBwc3BvdC5jb21cIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTA2MTU3OTU0NjU5XCIsXG4gIGFwcElkOiBcIjE6MTA2MTU3OTU0NjU5OndlYjozZTE4OTExMDIzNmEyMTM4NDM4YTU2XCIsXG4gIG1lYXN1cmVtZW50SWQ6IFwiRy1aNkdLMTlLM0wwXCIsXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcbmNvbnN0IGF1dGggPSBnZXRBdXRoKCk7XG4vLyBHZXQgYSByZWZlcmVuY2UgdG8gdGhlIGRhdGFiYXNlIHNlcnZpY2VcblxuY29uc3QgZ29vZ2xlUHJvdmlkZXIgPSBuZXcgR29vZ2xlQXV0aFByb3ZpZGVyKCk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG4vKlxuaWYgKGxvY2F0aW9uLmhvc3RuYW1lID09PSBcImxvY2FsaG9zdFwiKSB7XG4gIC8vIFBvaW50IHRvIHRoZSBSVERCIGVtdWxhdG9yIHJ1bm5pbmcgb24gbG9jYWxob3N0LlxuY29ubmVjdEF1dGhFbXVsYXRvcihhdXRoLCBcImh0dHA6Ly9sb2NhbGhvc3Q6OTA5OVwiKTtcbn1cbiovXG5pZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJsb2dpblwiKSkge1xuICBjb25zdCBBcHAgPSBmdW5jdGlvbiBfQXBwKCkge1xuICAgIHJldHVybiBgXG5cbiAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIHctMTAwIGgtMTAwIHBvc2l0aW9uLXJlbGF0aXZlICR7X0FwcC5zdGF0ZS5jbGFzc31cIiBzdHlsZT1cIiAgICBtaW4td2lkdGg6IDEwMHZ3ICFpbXBvcnRhbnQ7XG4gICAgbWluLWhlaWdodDogMTAwdmggIWltcG9ydGFudDsgXCI+XG4gICAgPGRpdiBjbGFzcz1cInNwaW5uZXItY29udGFpbmVyIHBvc2l0aW9uLWFic29sdXRlIHRvcC01MFxuICAgICAgICAgICAgICAgIGxlZnQtNTBcIiBzdHlsZT0gXCJ3aWR0aDogMTAwJTsgdGV4dC1hbGlnbjogY2VudGVyXCI+XG5cbiAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lci1ncm93IHRleHQtcHJpbWFyeSBcIiByb2xlPVwic3RhdHVzXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj5Mb2FkaW5nLi4uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cblxuXG4gICAgYDtcbiAgfTtcbiAgQXBwLnN0YXRlID0ge1xuICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgIGNsYXNzOiBcImQtbm9uZVwiLFxuICAgIGNvdW50OiAwLFxuICAgIHRvZ2dsZVN0YXRlOiAoKSA9PiB7XG4gICAgICBzZXRTdGF0ZSgoKSA9PiB7XG4gICAgICAgIEFwcC5zdGF0ZS5sb2FkaW5nID0gQXBwLnN0YXRlLmxvYWRpbmcgPyBmYWxzZSA6IHRydWU7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xuXG4gIGZ1bmN0aW9uIHRvZ2dsZUxvYWRpbmcoKSB7XG4gICAgaWYgKEFwcC5zdGF0ZS5sb2FkaW5nID09IHRydWUpIHtcbiAgICAgIEFwcC5zdGF0ZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICBBcHAuc3RhdGUuY2xhc3MgPSBcImQtbm9uZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBBcHAuc3RhdGUubG9hZGluZyA9IHRydWU7XG4gICAgICBBcHAuc3RhdGUuY2xhc3MgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gICQoXCIjZ29vZ2xlLXNpZ24taW5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICQoXCJtYWluXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuXG4gICAgJChcIiNzcGlubmVyLWJveFwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICBzaWduSW5XaXRoUmVkaXJlY3QoYXV0aCwgZ29vZ2xlUHJvdmlkZXIpO1xuICB9KTtcbiAgb25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsICh1c2VyKSA9PiB7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIGdldFJlZGlyZWN0UmVzdWx0KGF1dGgpXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gR29vZ2xlQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWxGcm9tUmVzdWx0KHJlc3VsdCk7XG4gICAgICAgICAgY29uc3QgdG9rZW4gPSBjcmVkZW50aWFsLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgIGNvbnN0IHVzZXIgPSByZXN1bHQudXNlcjtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIC8vIEhhbmRsZSBFcnJvcnMgaGVyZS5cbiAgICAgICAgICBjb25zdCBlcnJvckNvZGUgPSBlcnJvci5jb2RlO1xuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgLy8gVGhlIGVtYWlsIG9mIHRoZSB1c2VyJ3MgYWNjb3VudCB1c2VkLlxuICAgICAgICAgIGNvbnN0IGVtYWlsID0gZXJyb3IuZW1haWw7XG4gICAgICAgICAgLy8gVGhlIEF1dGhDcmVkZW50aWFsIHR5cGUgdGhhdCB3YXMgdXNlZC5cbiAgICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gR29vZ2xlQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWxGcm9tRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIC8vIC4uLlxuICAgICAgICB9KVxuICAgICAgICAuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UoXCIvXCIpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNzcGlubmVyLWJveFwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcbiAgICAgICQoXCJtYWluXCIpLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpO1xuICAgICAgY29uc29sZS5sb2coXCIgc2lnbmVkIG91dFwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImxhenktbW9kdWxlLmxvZ2luXCIgKi8gXCIuL2xhenktbW9kdWxlXCIpLnRoZW4oXG4gICAgKG1vZHVsZSkgPT4ge1xuICAgICAgY29uc3QgbG9naW4gPSBtb2R1bGUuZGVmYXVsdDtcblxuICAgICAgbG9naW4oKTtcbiAgICB9XG4gICk7XG59XG5cblxuaWYoJCgnYm9keScpLmhhc0NsYXNzKCdmaWxtLWxvY2F0aW9uJykpe1xuXG5cbiBsZXQgbWFwID0gTC5tYXAoJ21hcCcpLnNldFZpZXcoWzAsIDBdLCA1KTs7XG5MLnRpbGVMYXllcignaHR0cHM6Ly97c30udGlsZS5vcGVuc3RyZWV0bWFwLm9yZy97en0ve3h9L3t5fS5wbmc/e2Zvb30nLCB7XG4gICAgICAgICAgICBmb286ICdiYXInLFxuICAgICAgICAgICAgYXR0cmlidXRpb246ICcmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+J1xuICAgICAgICB9KS5hZGRUbyhtYXApO1xuXG5cbiAgICAgICAgICAgZnVuY3Rpb24gZXh0cmFjdERhdGEgKCkge1xuICAgICAgICAgICAgICBsZXQgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFibGUnKVxuXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXVxuICAgICAgICAgICAgICBjb25zdCBtYXJrZXJzID0gW11cbiAgICAgICAgICAgICAgY29uc3QgYWxsY29vcmRzID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMTsgaW5kZXggPCB0YWJsZS5yb3dzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICBjb25zdCByb3cgPSB0YWJsZS5yb3dzW2luZGV4XTtcbiAgICAgICAgICAgICAgbGV0IGxvY2F0aW9uID0gcm93LmNlbGxzWzBdLmlubmVyVGV4dFxuICAgICAgICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSByb3cuY2VsbHNbMV1cbiAgICAgICAgICAgICAgbGV0IGxhdCA9IGNvb3JkaW5hdGVzLmZpcnN0RWxlbWVudENoaWxkLmlubmVyVGV4dFxuICAgICAgICAgICAgICBsZXQgbG9uID0gY29vcmRpbmF0ZXMubGFzdEVsZW1lbnRDaGlsZC5pbm5lclRleHRcbiAgICAgICAgICAgICAgbGV0IGNvb3JkcyA9IFtsYXQsIGxvbl1cbiAgICAgICAgICAgICAgYWxsY29vcmRzLnB1c2goY29vcmRzKVxuICAgICAgICAgICAgICBsZXQgbWFya2VyID0gTC5tYXJrZXIoW2xhdCwgbG9uXSk7XG4gICAgICAgICAgICAgIG1hcmtlci5iaW5kUG9wdXAobG9jYXRpb24pO1xuICAgICAgICAgICAgICBtYXJrZXIuYWRkVG8obWFwKTtcblxuICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICBpZiAoaW5kZXggPCA0KXtcbiAgICAgICAgICAgICAgbWFya2Vycy5wdXNoKFtsYXQsbG9uXSlcbiAgICAgICAgICAgICAgbGV0IG1hcmtlciA9IEwubWFya2VyKFtsYXQsIGxvbl0pO1xuICAgICAgICAgICAgICBtYXJrZXIuYmluZFBvcHVwKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgbWFya2VyLmFkZFRvKG1hcCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG5cblxuICAgICAgICAgICAgICAvLyAvY29uc29sZS5sb2cobGF0LCBsb24pXG4gICAgICAgICAgICAgIGxldCBtYXJrZXIgPSBMLm1hcmtlcihbbGF0LCBsb25dKTtcbiAgICAgICAgICAgICAgbWFya2VyLmJpbmRQb3B1cChsb2NhdGlvbik7XG4gICAgICAgICAgICAgIG1hcmtlci5hZGRUbyhtYXApO1xuICAgICAgICAgICAgICB9Ki9cblxufVxuLy9jb25zb2xlLmxvZyhhbGxjb29yZHMpXG5jb25zdCBmaXJzdEMgPSBhbGxjb29yZHNbMF1cbmNvbnN0IG9yZGVyZWQgPSBvcmRlckJ5RGlzdGFuY2UoZmlyc3RDLCBhbGxjb29yZHMpO1xuXG4vL2NvbnNvbGUubG9nKG9yZGVyZWQpXG5pZiAob3JkZXJlZC5sZW5ndGggPiAzKXtcbiAgbGV0IG5ld0FyciA9IG9yZGVyZWQuc2xpY2UoMCwzKVxuICBjb25zb2xlLmxvZyhuZXdBcnIpXG4gIG1hcC5maXRCb3VuZHMoW25ld0Fycl0pXG4gIG1hcC56b29tT3V0KDUpXG5cbn1cbmVsc2UgaWYgKG9yZGVyZWQubGVuZ3RoIDwgMyl7XG4gIG1hcC5maXRCb3VuZHMoW29yZGVyZWRdKVxuICBtYXAuem9vbU91dCg1KVxufVxuXG5cbi8vbWFwLmZpdEJvdW5kcyhyZXN1bHQpXG5cbn1cbmV4dHJhY3REYXRhKClcblxufTtcblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoZXZlbnQpID0+IHtcbiAgJChcIiN0ZXN0QnRuXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBteU1vZGFsID0gbmV3IGJvb3RzdHJhcC5Nb2RhbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGFsU2lnbk91dFwiKSk7XG4gICAgbXlNb2RhbC50b2dnbGUoKTtcbiAgfSk7XG5cbiAgb25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsICh1c2VyKSA9PiB7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgICQoXCIjc2lnbi1pbi1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAkKFwiI3NpZ24tb3V0LWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoXCIjc2lnbi1vdXQtZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgJChcIiNzaWduLWluLWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgfVxuICB9KTtcblxuICAkKFwiI3NpZ24tb3V0XCIpLm9uKFwiY2xpY2tcIiwgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2lnbk91dChhdXRoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgbXlNb2RhbCA9IG5ldyBib290c3RyYXAuTW9kYWwoXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbFNpZ25PdXRcIilcbiAgICAgICAgKTtcbiAgICAgICAgbXlNb2RhbC50b2dnbGUoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7fSk7XG4gIH0pO1xuXG4gICQoXCIjdXNlci1idG5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgLy8gTW92aWUgRGlyZWN0b3J5XG59KTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBVUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBR0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFEQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUdBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/index.js\n");

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