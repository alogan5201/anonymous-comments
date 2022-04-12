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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dompurify */ \"./node_modules/dompurify/dist/purify.js\");\n/* harmony import */ var dompurify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dompurify__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ \"./node_modules/firebase/app/dist/index.esm.js\");\n/* harmony import */ var firebase_database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/database */ \"./node_modules/firebase/database/dist/index.esm.js\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/auth */ \"./node_modules/firebase/auth/dist/index.esm.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! picturefill */ \"./node_modules/picturefill/dist/picturefill.js\");\n/* harmony import */ var picturefill__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(picturefill__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! utils/errors */ \"./src/js/utils/errors.js\");\n/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(utils_errors__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash */ \"./node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_6__);\n/** Variables available in all js files:\n * all the exported constants from globals.js\n */\n\n/** Directories available as aliases\n * all the paths within Dir in globals.js\n */\n\n\n\n\n\n\n\nlet url = window.location.href;\n\nDate.prototype.toShortFormat = function () {\n  let monthNames = [\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];\n  let day = this.getDate();\n  let monthIndex = this.getMonth();\n  let monthName = monthNames[monthIndex];\n  let year = this.getFullYear();\n  return `${monthName} ${year}`;\n}; // Now any Date object can be declared\n\n\nlet anyDate = new Date(1528578000000); // and it can represent itself in the custom format defined above.\n\nlet today = new Date();\nconst prettyDate = today.toShortFormat();\nvar firebaseConfig = {\n  apiKey: \"AIzaSyBCU8RRxV3qaSyxOgc4ObSWmUhlfnJsYTo\",\n  authDomain: \"geotools-bc75a.firebaseapp.com\",\n  projectId: \"geotools-bc75a\",\n  storageBucket: \"geotools-bc75a.appspot.com\",\n  messagingSenderId: \"106157954659\",\n  appId: \"1:106157954659:web:3e189110236a2138438a56\",\n  measurementId: \"G-Z6GK19K3L0\"\n};\nconst app = Object(firebase_app__WEBPACK_IMPORTED_MODULE_1__[\"initializeApp\"])(firebaseConfig);\nconst auth = Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getAuth\"])(); // Get a reference to the database service\n\nconst googleProvider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"]();\n/*\nif (location.hostname === \"localhost\") {\n  // Point to the RTDB emulator running on localhost.\nconnectAuthEmulator(auth, \"http://localhost:9099\");\n}\n*/\n\nif (window.location.href.includes(\"login\")) {\n  const App = function _App() {\n    return `\n\n       <div class=\"container w-100 h-100 position-relative ${_App.state.class}\" style=\"    min-width: 100vw !important;\n    min-height: 100vh !important; \">\n    <div class=\"spinner-container position-absolute top-50\n                left-50\" style= \"width: 100%; text-align: center\">\n\n       <div class=\"spinner-grow text-primary \" role=\"status\">\n                <span class=\"visually-hidden\">Loading...</span>\n            </div>\n\n    </div>\n\n        </div>\n\n\n    `;\n  };\n\n  App.state = {\n    loading: false,\n    class: \"d-none\",\n    count: 0,\n    toggleState: () => {\n      setState(() => {\n        App.state.loading = App.state.loading ? false : true;\n      });\n    }\n  };\n\n  function toggleLoading() {\n    if (App.state.loading == true) {\n      App.state.loading = false;\n      App.state.class = \"d-none\";\n    } else {\n      App.state.loading = true;\n      App.state.class = \"\";\n    }\n  }\n\n  $(\"#google-sign-in\").on(\"click\", function (e) {\n    e.preventDefault();\n    $(\"main\").addClass(\"d-none\");\n    $(\"#spinner-box\").removeClass(\"d-none\");\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signInWithRedirect\"])(auth, googleProvider);\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"getRedirectResult\"])(auth).then(result => {\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromResult(result);\n        const token = credential.accessToken;\n        const user = result.user;\n      }).catch(error => {\n        // Handle Errors here.\n        const errorCode = error.code;\n        const errorMessage = error.message; // The email of the user's account used.\n\n        const email = error.email; // The AuthCredential type that was used.\n\n        const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"GoogleAuthProvider\"].credentialFromError(error); // ...\n      }).finally(() => {\n        window.location.replace(\"/\");\n      });\n    } else {\n      $(\"#spinner-box\").addClass(\"d-none\");\n      $(\"main\").removeClass(\"d-none\");\n    }\n  });\n  __webpack_require__.e(/*! import() | lazy-module.login */ \"lazy-module.login\").then(__webpack_require__.bind(null, /*! ./lazy-module */ \"./src/js/lazy-module.js\")).then(module => {\n    const login = module.default;\n    login();\n  });\n}\n\nfunction extractObjValues(obj) {\n  const result = [];\n\n  for (const property in obj) {\n    let object = {\n      key: property,\n      value: obj[property]\n    };\n    result.push(object);\n  }\n\n  return result;\n}\n/*\n\n mainForm.on('submit', e => {\n        e.preventDefault()\n\n        $('#submitted-message').innerHTML = `<b>Sanitized Message</b>: ${dompurify.sanitize(mainForm.message.value)}`\n\n        import(/* webpackChunkName: \"lazy-module.lazy\"  './lazy-module').then(module => {\n          const foo = module.default\n\n          foo()\n      })\n  })\n*/\n\n\nwindow.addEventListener(\"DOMContentLoaded\", event => {\n  const db = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"getDatabase\"])();\n\n  if (document.getElementById(\"comment-form\")) {\n    const mostViewedPosts = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"query\"])(Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages'), Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"orderByValue\"])());\n    const messageRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages/');\n    Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"get\"])(messageRef).then(snapshot => {\n      if (snapshot.exists()) {\n        console.log(snapshot.val());\n        const data = snapshot.val();\n        const map = new Map(Object.entries(data));\n\n        for (const [key, value] of map.entries()) {\n          const dateinfo = value.date ? value.date : \"\";\n          let newObject = {\n            \"id\": key,\n            \"name\": value.name,\n            \"message\": value.message\n          };\n\n          if (!value.replies) {\n            $(\"#comment-section\").append(`<div class=\"row d-flex justify-content-center mt-5 comment-box bg-light\">\n\n          <div class=\"col-md-12 col-lg-12 col-xl-12\">\n          <div class=\"card border-0 \">\n            <div class=\"card-body\" id = \"${key}\">\n              <div class=\"d-flex flex-start align-items-center border-bottom\">\n\n\n                  <h6 class=\"fw-bold text-primary mb-1\">${value.name}</h6>\n                  <p class=\"text-muted small mb-0\">\n                   ${dateinfo}\n                  </p>\n\n              </div>\n\n              <p class=\"mt-3 mb-0 pb-2\">\n             ${value.message}\n              </p>\n\n              <div class=\"small d-flex justify-content-start\">\n                <a href=\"#!\" class=\"d-flex align-items-center me-3\">\n                  <i class=\"far fa-thumbs-up me-2\"></i>\n\n                </a>\n                <a href=\"#!\" class=\"d-flex align-items-center me-3\">\n                  <i class=\"far fa-thumbs-down me-2\"></i>\n\n                </a>\n                <a href=\"#!\" class=\"d-flex align-items-center me-3 reply-btn\">\n                  <i class=\"far fa-comment-dots me-2\"></i>\n                  <p class=\"m-0\">Reply</p>\n                </a>\n\n              </div>\n            </div>\n            <div class=\"card-footer py-3 border-0  row justify-content-end\" style=\"background-color: #f8f9fa;\">\n            <div class = \"other-comments\">s\n\n            </div>\n            </div>\n          </div>\n        </div>\n        </div>`);\n          } else {\n            console.log('theres replies');\n          }\n        }\n      } else {\n        console.log(\"No data available\");\n      }\n    }).catch(error => {\n      console.error(error);\n    });\n    /*\n    onValue(messageRef, (snapshot) => {\n      const data = snapshot.val();\n      const map = new Map(Object.entries(data));\n      //console.log(map); // Map(2) {\"foo\" => \"bar\", \"baz\" => 42}\n      for (const [key, value] of map.entries()) {\n         let newObject= {\n          \"id\": key,\n          \"name\": value.name,\n          \"message\": value.message\n        }\n        $( \"#comment-section\" ).append( `<div class=\"d-flex\">\n         <div id = \"${key}\" class=\"ms-3\">\n          <div class=\"fw-bold\">${value.name}</div>\n          ${value.message}\n        </div>\n      </div>` );\n       }\n    });\n    */\n\n    $(\"#comment-form\").on(\"submit\", function (e) {\n      e.preventDefault();\n      $(\"#comment-btn\").disabled = true;\n      let name = e.currentTarget[0].value;\n      let message = e.currentTarget[1].value;\n      console.log(name);\n      let commentSection = document.getElementById(\"comment-section\");\n\n      if (name && message) {\n        let cleanMessage = dompurify__WEBPACK_IMPORTED_MODULE_0___default.a.sanitize(message);\n        let cleanName = dompurify__WEBPACK_IMPORTED_MODULE_0___default.a.sanitize(name);\n        console.log(cleanMessage);\n        console.log(cleanName);\n        const postListRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages');\n        const newPostRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"push\"])(postListRef);\n        Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"set\"])(newPostRef, {\n          name: cleanName,\n          message: cleanMessage,\n          date: prettyDate\n        });\n        $(\"#comment-section\").append(`<div class=\"d-flex comment-box\">\n\n        <div class=\"ms-3 \">\n          <div class=\"fw-bold\">${cleanName}</div>\n          ${cleanMessage}\n        </div>\n      </div>`);\n      } else if (!name && message) {\n        let guest = 'Guest';\n        let cleanMessage = dompurify__WEBPACK_IMPORTED_MODULE_0___default.a.sanitize(message);\n        const postListRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"ref\"])(db, 'messages');\n        const newPostRef = Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"push\"])(postListRef);\n        Object(firebase_database__WEBPACK_IMPORTED_MODULE_2__[\"set\"])(newPostRef, {\n          name: guest,\n          message: cleanMessage\n        });\n      }\n    });\n    $('#comment-section').on('click', '.reply-btn', function (e) {\n      e.preventDefault();\n      console.log(e.target);\n      let siblings = $(this).parent().parent().siblings();\n      let otherComments = siblings[0];\n      console.log($(this).closest(\"div.other-comments\")); //var parentTag = $(this).parent().parent().attr('id');\n\n      var parentTag = $(this).parent().parent().attr('id');\n      var grandFather = $(this).parent().parent().parent().children().last().children();\n      let footer = $(this).parent().parent().parent().children().last();\n      let replySection = $(this).parent().parent().parent().children().last().children();\n      $(replySection).addClass('d-none');\n      console.log(footer);\n      $(footer).append(`\n\n  <form class=\"reply-form\">\n    <div class=\"d-flex flex-start w-100 justify-content-end\">\n      <div class=\"col-md-11\" >\n       <div class=\"form-outline w-100\">\n\n         <div class=\"mb-3\" >\n\n           <input type=\"text\" class=\"form-control\" id=\"exampleInputEmail1\" aria-describedby=\"replyName\" placeholder=\"Name (Optional)\">\n\n\n         </div>\n\n         <textarea class=\"form-control\" id=\"textAreaExample\" rows=\"4\"\n           style=\"background: #fff;\" placeholder=\"Write a comment.\"></textarea>\n\n       </div>\n      </div>\n\n       </div>\n\n       <div class=\"float-end mt-2 pt-1\">\n        <button type=\"submit\" class=\"btn btn-primary btn-sm\">Send <i class=\"far fa-paper-plane\"></i></button>\n      </div>\n  </form>\n\n\n\n  `);\n      $('.reply-form').on('submit', function (e) {\n        e.preventDefault();\n        let inputs = e.target.elements; //console.log(e.target.elements)\n\n        let name = inputs[0].value.length > 0 ? inputs[0].value : \"Anonymous\";\n        let message = inputs[1];\n        var parent = $(this).parent();\n        let siblings = $(this).siblings();\n        let otherComments = siblings[1];\n        console.log($(this).parent());\n        console.log($(this).siblings());\n        $(this).animate({\n          opacity: 0\n        }, 1000, function () {\n          $(this).css('display', 'none');\n          $(siblings[0]).removeClass(\"d-none\");\n          $(siblings[0]).append(`\n        <div class=\"col-md-11 p-3\" style = \"background-color: white !important\">\n        <div class=\"d-flex justify-content-between align-items-center border-bottom pb-2\">\n        <h6 class=\"fw-bold text-primary mb-1 \">${name}</h6>\n        <p class=\"text-muted small m-0\">\n        ${prettyDate}\n        </p>\n        </div>\n        <p class=\"mt-3 mb-0 pb-2\">\n        ${message.value}\n        </p>\n        </div>\n        `);\n          $(otherComments).animate({\n            opacity: 1\n          }, 500); // $('#one').animate({opacity: 1}, 500);\n        });\n        /*\n        setTimeout(() => {\n          $(otherComments).append(\n            `\n        \n        \n            <div class=\"col-md-11 p-3\" style = \"background-color: white !important\">\n        \n        \n            <div class=\"d-flex justify-content-between align-items-center border-bottom pb-2\">\n        \n            <h6 class=\"fw-bold text-primary mb-1 \">${name}</h6>\n            <p class=\"text-muted small m-0\">\n            ${prettyDate}\n            </p>\n            </div>\n            <p class=\"mt-3 mb-0 pb-2\">\n            ${message.value}\n            </p>\n            </div>\n            `\n        \n                );\n                console.log($(otherComments).removeClass('d-none'))\n        }, 5000);\n        */\n      });\n    });\n  }\n\n  $(\"#testBtn\").on(\"click\", function () {\n    var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n    myModal.toggle();\n  });\n  Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"onAuthStateChanged\"])(auth, user => {\n    if (user) {\n      $(\"#sign-in-elm\").css(\"display\", \"none\");\n      $(\"#sign-out-elm\").css(\"display\", \"block\");\n    } else {\n      $(\"#sign-out-elm\").css(\"display\", \"none\");\n      $(\"#sign-in-elm\").css(\"display\", \"block\");\n    }\n  });\n  $(\"#sign-out\").on(\"click\", async function (e) {\n    e.preventDefault();\n    Object(firebase_auth__WEBPACK_IMPORTED_MODULE_3__[\"signOut\"])(auth).then(() => {\n      var myModal = new bootstrap.Modal(document.getElementById(\"modalSignOut\"));\n      myModal.toggle();\n    }).catch(error => {});\n  });\n  $(\"#user-btn\").on(\"click\", function (e) {\n    e.preventDefault();\n  }); // Movie Directory\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvaW5kZXguanM/N2JhNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVmFyaWFibGVzIGF2YWlsYWJsZSBpbiBhbGwganMgZmlsZXM6XG4gKiBhbGwgdGhlIGV4cG9ydGVkIGNvbnN0YW50cyBmcm9tIGdsb2JhbHMuanNcbiAqL1xuXG4vKiogRGlyZWN0b3JpZXMgYXZhaWxhYmxlIGFzIGFsaWFzZXNcbiAqIGFsbCB0aGUgcGF0aHMgd2l0aGluIERpciBpbiBnbG9iYWxzLmpzXG4gKi9cblxuaW1wb3J0IGRvbXB1cmlmeSBmcm9tIFwiZG9tcHVyaWZ5XCI7XG5pbXBvcnQgeyBpbml0aWFsaXplQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCBnZXQsICBvblZhbHVlLCBwdXNoLCBxdWVyeSwgb3JkZXJCeVZhbHVlIH0gZnJvbSBcImZpcmViYXNlL2RhdGFiYXNlXCI7XG5cbmltcG9ydCB7XG4gIGdldEF1dGgsXG4gIHNpZ25JbldpdGhSZWRpcmVjdCxcbiAgZ2V0UmVkaXJlY3RSZXN1bHQsXG4gIHNpZ25PdXQsXG4gIEdvb2dsZUF1dGhQcm92aWRlcixcbiAgb25BdXRoU3RhdGVDaGFuZ2VkLFxuICBjb25uZWN0QXV0aEVtdWxhdG9yLFxufSBmcm9tIFwiZmlyZWJhc2UvYXV0aFwiO1xuXG5pbXBvcnQgXCJwaWN0dXJlZmlsbFwiO1xuaW1wb3J0IFwidXRpbHMvZXJyb3JzXCI7XG5pbXBvcnQgeyByZXN1bHQgfSBmcm9tIFwibG9kYXNoXCI7XG5sZXQgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5EYXRlLnByb3RvdHlwZS50b1Nob3J0Rm9ybWF0ID0gZnVuY3Rpb24oKSB7XG5cbiAgbGV0IG1vbnRoTmFtZXMgPVtcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFxuICAgICAgICAgICAgICAgICAgICBcIk1heVwiLFwiSnVuXCIsXCJKdWxcIixcIkF1Z1wiLFxuICAgICAgICAgICAgICAgICAgICBcIlNlcFwiLCBcIk9jdFwiLFwiTm92XCIsXCJEZWNcIl07XG5cbiAgbGV0IGRheSA9IHRoaXMuZ2V0RGF0ZSgpO1xuXG4gIGxldCBtb250aEluZGV4ID0gdGhpcy5nZXRNb250aCgpO1xuICBsZXQgbW9udGhOYW1lID0gbW9udGhOYW1lc1ttb250aEluZGV4XTtcblxuICBsZXQgeWVhciA9IHRoaXMuZ2V0RnVsbFllYXIoKTtcblxuICByZXR1cm4gYCR7bW9udGhOYW1lfSAke3llYXJ9YDtcbn1cblxuLy8gTm93IGFueSBEYXRlIG9iamVjdCBjYW4gYmUgZGVjbGFyZWRcbmxldCBhbnlEYXRlID0gbmV3IERhdGUoMTUyODU3ODAwMDAwMCk7XG5cbi8vIGFuZCBpdCBjYW4gcmVwcmVzZW50IGl0c2VsZiBpbiB0aGUgY3VzdG9tIGZvcm1hdCBkZWZpbmVkIGFib3ZlLlxuXG5sZXQgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuXG5jb25zdCBwcmV0dHlEYXRlID0gdG9kYXkudG9TaG9ydEZvcm1hdCgpXG5cbnZhciBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBcIkFJemFTeUJDVThSUnhWM3FhU3l4T2djNE9iU1dtVWhsZm5Kc1lUb1wiLFxuICBhdXRoRG9tYWluOiBcImdlb3Rvb2xzLWJjNzVhLmZpcmViYXNlYXBwLmNvbVwiLFxuICBwcm9qZWN0SWQ6IFwiZ2VvdG9vbHMtYmM3NWFcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJnZW90b29scy1iYzc1YS5hcHBzcG90LmNvbVwiLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxMDYxNTc5NTQ2NTlcIixcbiAgYXBwSWQ6IFwiMToxMDYxNTc5NTQ2NTk6d2ViOjNlMTg5MTEwMjM2YTIxMzg0MzhhNTZcIixcbiAgbWVhc3VyZW1lbnRJZDogXCJHLVo2R0sxOUszTDBcIixcbn07XG5cbmNvbnN0IGFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoKTtcbi8vIEdldCBhIHJlZmVyZW5jZSB0byB0aGUgZGF0YWJhc2Ugc2VydmljZVxuXG5jb25zdCBnb29nbGVQcm92aWRlciA9IG5ldyBHb29nbGVBdXRoUHJvdmlkZXIoKTtcblxuLypcbmlmIChsb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIikge1xuICAvLyBQb2ludCB0byB0aGUgUlREQiBlbXVsYXRvciBydW5uaW5nIG9uIGxvY2FsaG9zdC5cbmNvbm5lY3RBdXRoRW11bGF0b3IoYXV0aCwgXCJodHRwOi8vbG9jYWxob3N0OjkwOTlcIik7XG59XG4qL1xuaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwibG9naW5cIikpIHtcbiAgY29uc3QgQXBwID0gZnVuY3Rpb24gX0FwcCgpIHtcbiAgICByZXR1cm4gYFxuXG4gICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lciB3LTEwMCBoLTEwMCBwb3NpdGlvbi1yZWxhdGl2ZSAke19BcHAuc3RhdGUuY2xhc3N9XCIgc3R5bGU9XCIgICAgbWluLXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xuICAgIG1pbi1oZWlnaHQ6IDEwMHZoICFpbXBvcnRhbnQ7IFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzcGlubmVyLWNvbnRhaW5lciBwb3NpdGlvbi1hYnNvbHV0ZSB0b3AtNTBcbiAgICAgICAgICAgICAgICBsZWZ0LTUwXCIgc3R5bGU9IFwid2lkdGg6IDEwMCU7IHRleHQtYWxpZ246IGNlbnRlclwiPlxuXG4gICAgICAgPGRpdiBjbGFzcz1cInNwaW5uZXItZ3JvdyB0ZXh0LXByaW1hcnkgXCIgcm9sZT1cInN0YXR1c1wiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+TG9hZGluZy4uLjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG5cblxuICAgIGA7XG4gIH07XG4gIEFwcC5zdGF0ZSA9IHtcbiAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICBjbGFzczogXCJkLW5vbmVcIixcbiAgICBjb3VudDogMCxcbiAgICB0b2dnbGVTdGF0ZTogKCkgPT4ge1xuICAgICAgc2V0U3RhdGUoKCkgPT4ge1xuICAgICAgICBBcHAuc3RhdGUubG9hZGluZyA9IEFwcC5zdGF0ZS5sb2FkaW5nID8gZmFsc2UgOiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcblxuICBmdW5jdGlvbiB0b2dnbGVMb2FkaW5nKCkge1xuICAgIGlmIChBcHAuc3RhdGUubG9hZGluZyA9PSB0cnVlKSB7XG4gICAgICBBcHAuc3RhdGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgQXBwLnN0YXRlLmNsYXNzID0gXCJkLW5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgQXBwLnN0YXRlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgQXBwLnN0YXRlLmNsYXNzID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICAkKFwiI2dvb2dsZS1zaWduLWluXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAkKFwibWFpblwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcblxuICAgICQoXCIjc3Bpbm5lci1ib3hcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgc2lnbkluV2l0aFJlZGlyZWN0KGF1dGgsIGdvb2dsZVByb3ZpZGVyKTtcbiAgfSk7XG4gIG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBnZXRSZWRpcmVjdFJlc3VsdChhdXRoKVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgIGNvbnN0IHRva2VuID0gY3JlZGVudGlhbC5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICBjb25zdCB1c2VyID0gcmVzdWx0LnVzZXI7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JzIGhlcmUuXG4gICAgICAgICAgY29uc3QgZXJyb3JDb2RlID0gZXJyb3IuY29kZTtcbiAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgIC8vIFRoZSBlbWFpbCBvZiB0aGUgdXNlcidzIGFjY291bnQgdXNlZC5cbiAgICAgICAgICBjb25zdCBlbWFpbCA9IGVycm9yLmVtYWlsO1xuICAgICAgICAgIC8vIFRoZSBBdXRoQ3JlZGVudGlhbCB0eXBlIHRoYXQgd2FzIHVzZWQuXG4gICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEdvb2dsZUF1dGhQcm92aWRlci5jcmVkZW50aWFsRnJvbUVycm9yKGVycm9yKTtcbiAgICAgICAgICAvLyAuLi5cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKFwiL1wiKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoXCIjc3Bpbm5lci1ib3hcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkKFwibWFpblwiKS5yZW1vdmVDbGFzcyhcImQtbm9uZVwiKTtcbiAgICB9XG4gIH0pO1xuXG4gIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImxhenktbW9kdWxlLmxvZ2luXCIgKi8gXCIuL2xhenktbW9kdWxlXCIpLnRoZW4oXG4gICAgKG1vZHVsZSkgPT4ge1xuICAgICAgY29uc3QgbG9naW4gPSBtb2R1bGUuZGVmYXVsdDtcblxuICAgICAgbG9naW4oKTtcbiAgICB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RPYmpWYWx1ZXMob2JqKXtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdXG5cbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBvYmopIHtcbiAgbGV0IG9iamVjdCA9IHtcbiAgIGtleTogcHJvcGVydHksXG4gICAgdmFsdWU6IG9ialtwcm9wZXJ0eV1cblxuICB9XG4gIHJlc3VsdC5wdXNoKG9iamVjdClcblxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cblxuLypcblxuIG1haW5Gb3JtLm9uKCdzdWJtaXQnLCBlID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgJCgnI3N1Ym1pdHRlZC1tZXNzYWdlJykuaW5uZXJIVE1MID0gYDxiPlNhbml0aXplZCBNZXNzYWdlPC9iPjogJHtkb21wdXJpZnkuc2FuaXRpemUobWFpbkZvcm0ubWVzc2FnZS52YWx1ZSl9YFxuXG4gICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImxhenktbW9kdWxlLmxhenlcIiAgJy4vbGF6eS1tb2R1bGUnKS50aGVuKG1vZHVsZSA9PiB7XG4gICAgICAgICAgY29uc3QgZm9vID0gbW9kdWxlLmRlZmF1bHRcblxuICAgICAgICAgIGZvbygpXG4gICAgICB9KVxuICB9KVxuKi9cblxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcblxuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21tZW50LWZvcm1cIikpe1xuICAgIGNvbnN0IG1vc3RWaWV3ZWRQb3N0cyA9IHF1ZXJ5KHJlZihkYiwgJ21lc3NhZ2VzJyksIG9yZGVyQnlWYWx1ZSgpKTtcbiAgICBjb25zdCBtZXNzYWdlUmVmPSByZWYoZGIsICdtZXNzYWdlcy8nICApO1xuICAgIGdldChtZXNzYWdlUmVmKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgICAgaWYgKHNuYXBzaG90LmV4aXN0cygpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNuYXBzaG90LnZhbCgpKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhkYXRhKSk7XG5cbiAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIG1hcC5lbnRyaWVzKCkpIHtcbiAgICAgICBjb25zdCBkYXRlaW5mbyA9IHZhbHVlLmRhdGUgPyB2YWx1ZS5kYXRlIDogXCJcIlxuICAgICAgICBsZXQgbmV3T2JqZWN0PSB7XG4gICAgICAgICAgXCJpZFwiOiBrZXksXG4gICAgICAgICAgXCJuYW1lXCI6IHZhbHVlLm5hbWUsXG4gICAgICAgICAgXCJtZXNzYWdlXCI6IHZhbHVlLm1lc3NhZ2VcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlLnJlcGxpZXMpe1xuICAgICAgICAgICQoIFwiI2NvbW1lbnQtc2VjdGlvblwiICkuYXBwZW5kKCBgPGRpdiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01IGNvbW1lbnQtYm94IGJnLWxpZ2h0XCI+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEyIGNvbC1sZy0xMiBjb2wteGwtMTJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBib3JkZXItMCBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWJvZHlcIiBpZCA9IFwiJHtrZXl9XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1zdGFydCBhbGlnbi1pdGVtcy1jZW50ZXIgYm9yZGVyLWJvdHRvbVwiPlxuXG5cbiAgICAgICAgICAgICAgICAgIDxoNiBjbGFzcz1cImZ3LWJvbGQgdGV4dC1wcmltYXJ5IG1iLTFcIj4ke3ZhbHVlLm5hbWV9PC9oNj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1tdXRlZCBzbWFsbCBtYi0wXCI+XG4gICAgICAgICAgICAgICAgICAgJHtkYXRlaW5mb31cbiAgICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8cCBjbGFzcz1cIm10LTMgbWItMCBwYi0yXCI+XG4gICAgICAgICAgICAgJHt2YWx1ZS5tZXNzYWdlfVxuICAgICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNtYWxsIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiIyFcIiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgbWUtM1wiPlxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtdGh1bWJzLXVwIG1lLTJcIj48L2k+XG5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMhXCIgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIG1lLTNcIj5cbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLXRodW1icy1kb3duIG1lLTJcIj48L2k+XG5cbiAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMhXCIgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIG1lLTMgcmVwbHktYnRuXCI+XG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhciBmYS1jb21tZW50LWRvdHMgbWUtMlwiPjwvaT5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwibS0wXCI+UmVwbHk8L3A+XG4gICAgICAgICAgICAgICAgPC9hPlxuXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1mb290ZXIgcHktMyBib3JkZXItMCAgcm93IGp1c3RpZnktY29udGVudC1lbmRcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmOGY5ZmE7XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzID0gXCJvdGhlci1jb21tZW50c1wiPnNcblxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PmAgKTtcblxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGVyZXMgcmVwbGllcycpXG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk5vIGRhdGEgYXZhaWxhYmxlXCIpO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSk7XG4gICAgLypcbiAgICBvblZhbHVlKG1lc3NhZ2VSZWYsIChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhkYXRhKSk7XG4gICAgICAvL2NvbnNvbGUubG9nKG1hcCk7IC8vIE1hcCgyKSB7XCJmb29cIiA9PiBcImJhclwiLCBcImJhelwiID0+IDQyfVxuICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgbWFwLmVudHJpZXMoKSkge1xuXG4gICAgICAgIGxldCBuZXdPYmplY3Q9IHtcbiAgICAgICAgICBcImlkXCI6IGtleSxcbiAgICAgICAgICBcIm5hbWVcIjogdmFsdWUubmFtZSxcbiAgICAgICAgICBcIm1lc3NhZ2VcIjogdmFsdWUubWVzc2FnZVxuICAgICAgICB9XG4gICAgICAgICQoIFwiI2NvbW1lbnQtc2VjdGlvblwiICkuYXBwZW5kKCBgPGRpdiBjbGFzcz1cImQtZmxleFwiPlxuXG4gICAgICAgIDxkaXYgaWQgPSBcIiR7a2V5fVwiIGNsYXNzPVwibXMtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmdy1ib2xkXCI+JHt2YWx1ZS5uYW1lfTwvZGl2PlxuICAgICAgICAgICR7dmFsdWUubWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5gICk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICAqL1xuXG4gICAgJChcIiNjb21tZW50LWZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcblxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4kKFwiI2NvbW1lbnQtYnRuXCIpLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGxldCBuYW1lID0gZS5jdXJyZW50VGFyZ2V0WzBdLnZhbHVlO1xuICAgICAgbGV0IG1lc3NhZ2UgPSBlLmN1cnJlbnRUYXJnZXRbMV0udmFsdWU7XG4gICAgICBjb25zb2xlLmxvZyhuYW1lKVxuICAgICAgbGV0IGNvbW1lbnRTZWN0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21tZW50LXNlY3Rpb25cIilcblxuICAgICAgaWYobmFtZSAmJiBtZXNzYWdlKXtcbiAgICAgIGxldCBjbGVhbk1lc3NhZ2U9ICBkb21wdXJpZnkuc2FuaXRpemUobWVzc2FnZSlcbiAgICAgIGxldCBjbGVhbk5hbWUgPSBkb21wdXJpZnkuc2FuaXRpemUobmFtZSlcbiAgICAgIGNvbnNvbGUubG9nKGNsZWFuTWVzc2FnZSlcbiAgICAgIGNvbnNvbGUubG9nKGNsZWFuTmFtZSlcbiAgICAgICAgY29uc3QgcG9zdExpc3RSZWYgPSByZWYoZGIsICdtZXNzYWdlcycpO1xuICAgICAgICBjb25zdCBuZXdQb3N0UmVmID0gcHVzaChwb3N0TGlzdFJlZik7XG4gICAgICAgIHNldChuZXdQb3N0UmVmLCB7XG4gICAgICAgICAgIG5hbWU6IGNsZWFuTmFtZSxcbiAgICAgICAgICAgbWVzc2FnZTogY2xlYW5NZXNzYWdlLFxuICAgICAgICAgICBkYXRlOiBwcmV0dHlEYXRlXG4gICAgICAgIH0pO1xuICAgICAgICAkKCBcIiNjb21tZW50LXNlY3Rpb25cIiApLmFwcGVuZCggYDxkaXYgY2xhc3M9XCJkLWZsZXggY29tbWVudC1ib3hcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwibXMtMyBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZnctYm9sZFwiPiR7Y2xlYW5OYW1lfTwvZGl2PlxuICAgICAgICAgICR7Y2xlYW5NZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PmAgKTtcbiAgICAgIH1cblxuICAgICAgZWxzZSBpZighbmFtZSAmJiBtZXNzYWdlKSB7XG4gICAgICAgICAgbGV0IGd1ZXN0ID0gJ0d1ZXN0J1xuICAgICAgICAgIGxldCBjbGVhbk1lc3NhZ2UgPSBkb21wdXJpZnkuc2FuaXRpemUobWVzc2FnZSlcbiAgICAgICAgICBjb25zdCBwb3N0TGlzdFJlZiA9IHJlZihkYiwgJ21lc3NhZ2VzJyk7XG4gICAgICAgICAgY29uc3QgbmV3UG9zdFJlZiA9IHB1c2gocG9zdExpc3RSZWYpO1xuXG4gICAgICAgICAgc2V0KG5ld1Bvc3RSZWYsIHtcbiAgICAgICAgICAgICBuYW1lOiBndWVzdCxcbiAgICAgICAgICAgICBtZXNzYWdlOiBjbGVhbk1lc3NhZ2VcbiAgICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgJCgnI2NvbW1lbnQtc2VjdGlvbicpLm9uKCdjbGljaycsICcucmVwbHktYnRuJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgY29uc29sZS5sb2coZS50YXJnZXQpXG5sZXQgc2libGluZ3MgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnNpYmxpbmdzKClcbmxldCBvdGhlckNvbW1lbnRzID0gc2libGluZ3NbMF1cblxuY29uc29sZS5sb2coICAkKHRoaXMpLmNsb3Nlc3QoXCJkaXYub3RoZXItY29tbWVudHNcIikpXG5cblxuICAgICAgLy92YXIgcGFyZW50VGFnID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5hdHRyKCdpZCcpO1xuICAgICAgdmFyIHBhcmVudFRhZyA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCkuYXR0cignaWQnKVxuICAgICAgdmFyIGdyYW5kRmF0aGVyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbigpLmxhc3QoKS5jaGlsZHJlbigpXG4gICAgICBsZXQgZm9vdGVyID0gICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKCkubGFzdCgpXG4gICAgICBsZXQgcmVwbHlTZWN0aW9uID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbigpLmxhc3QoKS5jaGlsZHJlbigpXG4gICAgICAkKHJlcGx5U2VjdGlvbikuYWRkQ2xhc3MoJ2Qtbm9uZScpXG4gICAgICBjb25zb2xlLmxvZyhmb290ZXIpXG5cbiAgJChmb290ZXIpLmFwcGVuZChgXG5cbiAgPGZvcm0gY2xhc3M9XCJyZXBseS1mb3JtXCI+XG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXN0YXJ0IHctMTAwIGp1c3RpZnktY29udGVudC1lbmRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTFcIiA+XG4gICAgICAgPGRpdiBjbGFzcz1cImZvcm0tb3V0bGluZSB3LTEwMFwiPlxuXG4gICAgICAgICA8ZGl2IGNsYXNzPVwibWItM1wiID5cblxuICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwiZXhhbXBsZUlucHV0RW1haWwxXCIgYXJpYS1kZXNjcmliZWRieT1cInJlcGx5TmFtZVwiIHBsYWNlaG9sZGVyPVwiTmFtZSAoT3B0aW9uYWwpXCI+XG5cblxuICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tY29udHJvbFwiIGlkPVwidGV4dEFyZWFFeGFtcGxlXCIgcm93cz1cIjRcIlxuICAgICAgICAgICBzdHlsZT1cImJhY2tncm91bmQ6ICNmZmY7XCIgcGxhY2Vob2xkZXI9XCJXcml0ZSBhIGNvbW1lbnQuXCI+PC90ZXh0YXJlYT5cblxuICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgICA8L2Rpdj5cblxuICAgICAgIDxkaXYgY2xhc3M9XCJmbG9hdC1lbmQgbXQtMiBwdC0xXCI+XG4gICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiPlNlbmQgPGkgY2xhc3M9XCJmYXIgZmEtcGFwZXItcGxhbmVcIj48L2k+PC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgPC9mb3JtPlxuXG5cblxuICBgKTtcblxuICAkKCcucmVwbHktZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgaW5wdXRzID0gZS50YXJnZXQuZWxlbWVudHNcbiAgICAgIC8vY29uc29sZS5sb2coZS50YXJnZXQuZWxlbWVudHMpXG4gICAgICBsZXQgbmFtZSA9IGlucHV0c1swXS52YWx1ZS5sZW5ndGggPiAwID8gaW5wdXRzWzBdLnZhbHVlOiBcIkFub255bW91c1wiXG5cbiAgICAgIGxldCBtZXNzYWdlID0gaW5wdXRzWzFdXG4gICAgICB2YXIgcGFyZW50ID0gJCh0aGlzKS5wYXJlbnQoKVxuICAgICAgbGV0IHNpYmxpbmdzID0gJCh0aGlzKS5zaWJsaW5ncygpXG5cbiAgICAgIGxldCBvdGhlckNvbW1lbnRzID0gc2libGluZ3NbMV1cblxuY29uc29sZS5sb2coJCh0aGlzKS5wYXJlbnQoKSlcbmNvbnNvbGUubG9nKCQodGhpcykuc2libGluZ3MoKSlcblxuICAgICAgJCh0aGlzKS5hbmltYXRlKHtvcGFjaXR5OiAwfSwgMTAwMCxmdW5jdGlvbigpe1xuICAgICAgJCh0aGlzKS5jc3MoJ2Rpc3BsYXknLCdub25lJyk7XG4gICAgICAgICQoc2libGluZ3NbMF0pLnJlbW92ZUNsYXNzKFwiZC1ub25lXCIpXG4gICAgICAkKHNpYmxpbmdzWzBdKS5hcHBlbmQoXG4gICAgICAgIGBcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMSBwLTNcIiBzdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogd2hpdGUgIWltcG9ydGFudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciBib3JkZXItYm90dG9tIHBiLTJcIj5cbiAgICAgICAgPGg2IGNsYXNzPVwiZnctYm9sZCB0ZXh0LXByaW1hcnkgbWItMSBcIj4ke25hbWV9PC9oNj5cbiAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LW11dGVkIHNtYWxsIG0tMFwiPlxuICAgICAgICAke3ByZXR0eURhdGV9XG4gICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwIGNsYXNzPVwibXQtMyBtYi0wIHBiLTJcIj5cbiAgICAgICAgJHttZXNzYWdlLnZhbHVlfVxuICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICBgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgJChvdGhlckNvbW1lbnRzKS5hbmltYXRlKHtvcGFjaXR5OiAxfSwgNTAwKTtcblxuICAgICAvLyAkKCcjb25lJykuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIDUwMCk7XG4gICAgfSk7XG5cblxuLypcbnNldFRpbWVvdXQoKCkgPT4ge1xuICAkKG90aGVyQ29tbWVudHMpLmFwcGVuZChcbiAgICBgXG5cblxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTEgcC0zXCIgc3R5bGUgPSBcImJhY2tncm91bmQtY29sb3I6IHdoaXRlICFpbXBvcnRhbnRcIj5cblxuXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1jZW50ZXIgYm9yZGVyLWJvdHRvbSBwYi0yXCI+XG5cbiAgICA8aDYgY2xhc3M9XCJmdy1ib2xkIHRleHQtcHJpbWFyeSBtYi0xIFwiPiR7bmFtZX08L2g2PlxuICAgIDxwIGNsYXNzPVwidGV4dC1tdXRlZCBzbWFsbCBtLTBcIj5cbiAgICAke3ByZXR0eURhdGV9XG4gICAgPC9wPlxuICAgIDwvZGl2PlxuICAgIDxwIGNsYXNzPVwibXQtMyBtYi0wIHBiLTJcIj5cbiAgICAke21lc3NhZ2UudmFsdWV9XG4gICAgPC9wPlxuICAgIDwvZGl2PlxuICAgIGBcblxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmxvZygkKG90aGVyQ29tbWVudHMpLnJlbW92ZUNsYXNzKCdkLW5vbmUnKSlcbn0sIDUwMDApO1xuKi9cblxuICB9KTtcbiAgfSk7XG4gIH1cbiAgJChcIiN0ZXN0QnRuXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBteU1vZGFsID0gbmV3IGJvb3RzdHJhcC5Nb2RhbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGFsU2lnbk91dFwiKSk7XG4gICAgbXlNb2RhbC50b2dnbGUoKTtcbiAgfSk7XG5cbiAgb25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsICh1c2VyKSA9PiB7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgICQoXCIjc2lnbi1pbi1lbG1cIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAkKFwiI3NpZ24tb3V0LWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoXCIjc2lnbi1vdXQtZWxtXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgJChcIiNzaWduLWluLWVsbVwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgfVxuICB9KTtcblxuICAkKFwiI3NpZ24tb3V0XCIpLm9uKFwiY2xpY2tcIiwgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgc2lnbk91dChhdXRoKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB2YXIgbXlNb2RhbCA9IG5ldyBib290c3RyYXAuTW9kYWwoXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RhbFNpZ25PdXRcIilcbiAgICAgICAgKTtcbiAgICAgICAgbXlNb2RhbC50b2dnbGUoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7fSk7XG4gIH0pO1xuXG4gICQoXCIjdXNlci1idG5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG5cbiAgLy8gTW92aWUgRGlyZWN0b3J5XG59KTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBSUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBVUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUtBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBR0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/index.js\n");

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