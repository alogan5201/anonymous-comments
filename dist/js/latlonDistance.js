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
/******/ 		"latlonDistance": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([2,"vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/latlonDistance.js":
/*!**********************************!*\
  !*** ./src/js/latlonDistance.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var haversine_geolocation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! haversine-geolocation */ \"./node_modules/haversine-geolocation/dist/build.js\");\n/* harmony import */ var haversine_geolocation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(haversine_geolocation__WEBPACK_IMPORTED_MODULE_0__);\n/*jshint esversion: 8 */\n\nconst geojson = {\n  type: \"FeatureCollection\",\n  features: [{\n    type: \"Feature\",\n    geometry: {\n      type: \"Point\",\n      coordinates: [0, 0]\n    },\n    properties: {\n      title: \"Mapbox DC\",\n      description: \"1714 14th St NW, Washington DC\",\n      \"marker-color\": \"#35A2D1\",\n      \"marker-size\": \"large\",\n      \"marker-symbol\": \"1\"\n    }\n  }, {\n    type: \"Feature\",\n    geometry: {\n      type: \"Point\",\n      coordinates: [0, 0]\n    },\n    properties: {\n      title: \"Mapbox SF\",\n      description: \"155 9th St, San Francisco\",\n      \"marker-color\": \"#fc4353\",\n      \"marker-size\": \"large\",\n      \"marker-symbol\": \"2\"\n    }\n  }]\n};\nconst map = L.mapbox.map(\"map\").setView([37.9, -77], 6);\nL.mapbox.accessToken = \"pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA\";\nconst layer = L.mapbox.styleLayer(\"mapbox://styles/mapbox/streets-v11\").addTo(map); // add your tiles to the map\n// L.marker is a low-level marker constructor in Leaflet.\n\nvar featureLayer = L.mapbox.featureLayer().addTo(map);\nvar locationControl = L.control.locate({\n  circleStyle: {\n    opacity: 0\n  },\n  followCircleStyle: {\n    opacity: 0\n  },\n  drawCircle: false,\n  follow: false,\n  icon: \"fas fa-map-marker-alt\",\n  // follow the user's location\n  setView: false,\n  remainActive: false\n}).addTo(map);\n\nconst LocationState = function _LocationState() {\n  let data = {\n    origin: {\n      lat: LocationState.state.lat\n    },\n    destination: {\n      lon: LocationState.state.lon\n    }\n  };\n  return data;\n};\n\nconst myhandler = {\n  set: function (obj, prop, value) {\n    obj[prop] = value;\n  }\n};\nLocationState.state = new Proxy({\n  lat: null,\n  lon: null\n}, myhandler);\n\nconst findLocation = () => {\n  map.on(\"locationfound\", function (e) {\n    map.fitBounds(e.bounds);\n    let lat = e.latlng.lat;\n    let lon = e.latlng.lng;\n    geojson.features[0].geometry.coordinates = [lon, lat];\n    featureLayer.setGeoJSON(geojson);\n    var inputs = document.getElementById(\"latlonForm\").elements;\n\n    if (inputs[0].nodeName === \"INPUT\" && inputs[0].type === \"number\") {\n      // Update text input\n      inputs[0].value = lat;\n      inputs[1].value = lon;\n    }\n\n    setTimeout(() => {\n      locationControl.stop();\n    }, 500);\n  });\n};\n\nconst title = $(\"title\").html();\nconst pageTitle = title.slice(11);\nlet bookmarkControl = new L.Control.Bookmarks({\n  name: pageTitle\n}).addTo(map);\n\nfunction inputFocus(x) {\n  if ($(\"#secondOutput\").hasClass(\"second\")) {\n    $(\"#secondOutput\").removeClass(\"second\").addClass(\"fadeOut\");\n    $(\"#firstOutput\").removeClass(\"first\").addClass(\"fadeOut\");\n    setTimeout(() => {\n      $(\"#secondOutput\").addClass(\"d-none\");\n      $(\"#firstOutput\").addClass(\"d-none\");\n    }, 2000);\n  } //\n\n}\n\nwindow.addEventListener(\"DOMContentLoaded\", () => {\n  findLocation();\n  const north = document.getElementById(\"north\");\n  const south = document.getElementById(\"south\");\n  const degreesLat = document.getElementById(\"degrees-lat\");\n  const minutesLat = document.getElementById(\"minutes-lat\");\n  const secondsLat = document.getElementById(\"seconds-lat\");\n  const degreesLon = document.getElementById(\"degrees-lon\");\n  const minutesLon = document.getElementById(\"minutes-lon\");\n  const secondsLon = document.getElementById(\"seconds-lon\");\n  const east = document.getElementById(\"east\");\n  const west = document.getElementById(\"west\");\n  const outputInputField = document.getElementById(\"output-field-input\");\n  const dmsBtn = document.getElementById(\"dmsBtn\");\n  const dmsForm = document.getElementById(\"dms\");\n  const latlonForm = document.getElementById(\"latlonForm\");\n\n  function DDtoDMS(lat, lon) {\n    //\n    let latitude = Math.abs(lat);\n    let longitude = Math.abs(lon);\n    let dLat = Math.floor(latitude);\n    let mLat = Math.floor((latitude - dLat) * 60);\n    sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3;\n    dLon = Math.floor(longitude);\n    mLon = Math.floor((longitude - dLon) * 60);\n    sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3;\n    let degreesLatitude = dLat;\n    let minutesLatitude = mLat;\n    let secondsLatitude = sLat;\n    let degreesLongitude = dLon;\n    let minutesLongitude = mLon;\n    let secondsLongitude = sLon;\n    let latResult = `${degreesLatitude}° ${minutesLatitude}' ${secondsLatitude}''`;\n    let lonResult = `${degreesLongitude}° ${minutesLongitude}' ${secondsLongitude}''`;\n    let result = {\n      lat: {\n        degrees: degreesLatitude,\n        minutes: minutesLatitude,\n        seconds: secondsLatitude\n      },\n      lon: {\n        degrees: degreesLongitude,\n        minutes: minutesLongitude,\n        seconds: secondsLongitude\n      },\n      popupMessage: {\n        lat: latResult,\n        lon: lonResult\n      }\n    };\n    return result;\n  }\n\n  function check(elm) {\n    document.getElementById(elm).checked = true;\n  }\n\n  const convertLocationData = document.getElementById(\"convertLocationData\");\n  const latInputField = document.getElementById(\"latInputField\");\n  const lonInputField = document.getElementById(\"lonInputField\");\n  const latlonGeocoderBtn = document.getElementById(\"latlonGeocoderBtn\");\n\n  const App = function _App() {\n    return `\n   <h1>Global State = [${App.state.count}] </h1>\n  `;\n  };\n\n  const handler = {\n    set: function (obj, prop, value) {\n      obj[prop] = value;\n    }\n  };\n  App.state = new Proxy({\n    count: 0\n  }, handler); // Initial Loading of the App\n\n  const CoordsApp = function _CoordsApp() {\n    return `\n   <h1>Origin State = [${CoordsApp.state.origin}] </h1> </br>\n   <h1>Destination State = [${CoordsApp.state.destination}] </h1>\n   <h1>User Location = [${CoordsApp.state.userLocation}] </h1>\n   <h1>trackingUser =  ${CoordsApp.state.trackingUser}</h1>\n  `;\n  };\n\n  const myhandler = {\n    set: function (obj, prop, value) {\n      obj[prop] = value;\n    }\n  };\n  CoordsApp.state = new Proxy({\n    origin: [],\n    destination: [],\n    userLocation: []\n  }, myhandler);\n  $(\"#originTest\").click(function (e) {\n    e.preventDefault();\n  });\n  $(\"#destinationTest\").click(function (e) {\n    e.preventDefault();\n  });\n  $(\"#switchTest\").click(function (e) {\n    e.preventDefault();\n  });\n\n  function addRoute() {\n    App.state.count++;\n    const origin = CoordsApp.state.origin;\n    const destination = CoordsApp.state.destination; //map.flyTo([centerLat, centerLon])\n\n    /* map.panInsideBounds([\n         [origin[1] , origin[0] ], // southwestern corner of the bounds\n         [destination[1] , destination[0], {padding: [50,50]} ] // northeastern corner of the bounds\n       ]);\n       //\n       geojson.features[0].geometry.coordinates = [origin[0], origin[1]];\n      geojson.features[1].geometry.coordinates = [destination[0], destination[1]]\n    */\n    //\n\n    let latD = destination[1];\n    let lonD = destination[0];\n    let latO = origin[1];\n    let lonO = origin[0];\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD]; //\n\n    featureLayer.setGeoJSON(geojson); //featureLayer.setGeoJSON(geojson).addTo(map);\n\n    /*\n      map.fitBounds(featureLayer.getBounds(), {\n    padding: [50,50]\n       });\n      map.zoomOut()\n    */\n\n    let latOrigin = origin[1];\n    let lonOrigin = origin[0];\n    let latDest = destination[1];\n    let lonDest = destination[0]; //\n\n    map.fitBounds([[latOrigin, lonOrigin], [latDest, lonDest]], {\n      padding: [50, 50]\n    });\n  }\n\n  function addNewRoute() {\n    const origin = CoordsApp.state.origin;\n    const destination = CoordsApp.state.destination;\n    let latD = destination[1];\n    let lonD = destination[0];\n    let latO = origin[1];\n    let lonO = origin[0];\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD];\n    featureLayer.setGeoJSON(geojson); // A simple line from origin to destination.\n    // A single point that animates along the route.\n    // Coordinates are initially set to origin.\n    // Calculate the distance in kilometers between route start/end point.\n    // animate(counter);\n\n    featureLayer.setGeoJSON(geojson);\n    let latOrigin = origin[1];\n    let lonOrigin = origin[0];\n    let latDest = destination[1];\n    let lonDest = destination[0]; //\n\n    map.fitBounds([[latOrigin, lonOrigin], [latDest, lonDest]], {\n      padding: [50, 50]\n    });\n  }\n\n  function format(time) {\n    // Hours, minutes and seconds\n    var hrs = ~~(time / 3600);\n    var mins = ~~(time % 3600 / 60);\n    let result = {\n      hours: hrs,\n      minutes: mins\n    }; // Output like \"1:01\" or \"4:03:59\" or \"123:03:59\"\n\n    return result;\n  }\n\n  function callMatrix(first, second) {\n    fetch(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${first};${second}?&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`).then(response => response.json()).then(json => {\n      const durations = json.durations[0];\n      const travelTime = durations[1];\n      const result = format(travelTime); // //\n\n      var alertPlaceholder = document.getElementById(\"liveAlertPlaceholder\");\n      var alertTrigger = document.getElementById(\"liveAlertBtn\");\n\n      function postLog(message) {\n        var wrapper = document.createElement(\"div\");\n        wrapper.innerHTML = `\n    <div class=\"alert alert-secondary d-flex align-items-center justify-content-between\" role=\"alert\">\n     <div class=\"alertMessage\">\n       ${message}\n     </div>\n\n\n   </div>`;\n        alertPlaceholder.append(wrapper);\n      }\n\n      if (alertPlaceholder.childElementCount == 0) {\n        postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);\n      } else if (alertPlaceholder.childElementCount == 1) {\n        postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);\n      } else if (alertPlaceholder.childElementCount == 2) {\n        $(\"#liveAlertPlaceholder\").empty();\n        setTimeout(() => {\n          postLog(`${result.hours} hour(s) and ${result.minutes}`);\n        }, 200);\n      }\n    });\n  }\n\n  $(\"#latlonForm\").on(\"submit\", function (e) {\n    e.preventDefault();\n    let inputs = document.getElementById(\"latlonForm\").elements;\n    let latO = inputs[0].value;\n    let lonO = inputs[1].value;\n    let latD = inputs[2].value;\n    let lonD = inputs[3].value;\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD];\n    featureLayer.setGeoJSON(geojson);\n    let origin = [latO, lonD];\n    let destination = [latD, lonD];\n    const points = [{\n      latitude: latO,\n      longitude: lonO\n    }, {\n      latitude: latD,\n      longitude: lonD\n    }];\n    const distance = haversine_geolocation__WEBPACK_IMPORTED_MODULE_0___default.a.getDistanceBetween(points[0], points[1], \"mi\");\n    $(\"#distanceInput\").val(`${distance} miles`);\n    map.fitBounds([[latO, lonO], [latD, lonD]], {\n      padding: [50, 50]\n    });\n  });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvbGF0bG9uRGlzdGFuY2UuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbGF0bG9uRGlzdGFuY2UuanM/OWY5YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKmpzaGludCBlc3ZlcnNpb246IDggKi9cbmltcG9ydCBIYXZlcnNpbmVHZW9sb2NhdGlvbiBmcm9tIFwiaGF2ZXJzaW5lLWdlb2xvY2F0aW9uXCI7XG5jb25zdCBnZW9qc29uID0ge1xuICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gIGZlYXR1cmVzOiBbXG4gICAge1xuICAgICAgdHlwZTogXCJGZWF0dXJlXCIsXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiBcIlBvaW50XCIsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbMCwgMF1cbiAgICAgIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpdGxlOiBcIk1hcGJveCBEQ1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjogXCIxNzE0IDE0dGggU3QgTlcsIFdhc2hpbmd0b24gRENcIixcbiAgICAgICAgXCJtYXJrZXItY29sb3JcIjogXCIjMzVBMkQxXCIsXG4gICAgICAgIFwibWFya2VyLXNpemVcIjogXCJsYXJnZVwiLFxuICAgICAgICBcIm1hcmtlci1zeW1ib2xcIjogXCIxXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIHR5cGU6IFwiRmVhdHVyZVwiLFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogXCJQb2ludFwiLFxuICAgICAgICBjb29yZGluYXRlczogWzAsIDBdXG4gICAgICB9LFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0aXRsZTogXCJNYXBib3ggU0ZcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiMTU1IDl0aCBTdCwgU2FuIEZyYW5jaXNjb1wiLFxuICAgICAgICBcIm1hcmtlci1jb2xvclwiOiBcIiNmYzQzNTNcIixcbiAgICAgICAgXCJtYXJrZXItc2l6ZVwiOiBcImxhcmdlXCIsXG4gICAgICAgIFwibWFya2VyLXN5bWJvbFwiOiBcIjJcIlxuICAgICAgfVxuICAgIH1cbiAgXVxufTtcblxuY29uc3QgbWFwID0gTC5tYXBib3gubWFwKFwibWFwXCIpLnNldFZpZXcoWzM3LjksIC03N10sIDYpO1xuTC5tYXBib3guYWNjZXNzVG9rZW4gPVxuICBcInBrLmV5SjFJam9pYkc5bllXNDFNakF4SWl3aVlTSTZJbU5yY1RReWJURm9aekUwYURReWVYTTFhR05tWW5SMU1ub2lmUS40a1JXTmZFSF9ZYW9fbW1kZ3JnalBBXCI7XG5cbmNvbnN0IGxheWVyID0gTC5tYXBib3hcbiAgLnN0eWxlTGF5ZXIoXCJtYXBib3g6Ly9zdHlsZXMvbWFwYm94L3N0cmVldHMtdjExXCIpXG4gIC5hZGRUbyhtYXApOyAvLyBhZGQgeW91ciB0aWxlcyB0byB0aGUgbWFwXG5cbi8vIEwubWFya2VyIGlzIGEgbG93LWxldmVsIG1hcmtlciBjb25zdHJ1Y3RvciBpbiBMZWFmbGV0LlxuXG52YXIgZmVhdHVyZUxheWVyID0gTC5tYXBib3guZmVhdHVyZUxheWVyKCkuYWRkVG8obWFwKTtcblxudmFyIGxvY2F0aW9uQ29udHJvbCA9IEwuY29udHJvbFxuICAubG9jYXRlKHtcbiAgICBjaXJjbGVTdHlsZTogeyBvcGFjaXR5OiAwIH0sXG4gICAgZm9sbG93Q2lyY2xlU3R5bGU6IHsgb3BhY2l0eTogMCB9LFxuICAgIGRyYXdDaXJjbGU6IGZhbHNlLFxuICAgIGZvbGxvdzogZmFsc2UsXG4gICAgaWNvbjogXCJmYXMgZmEtbWFwLW1hcmtlci1hbHRcIiwgLy8gZm9sbG93IHRoZSB1c2VyJ3MgbG9jYXRpb25cbiAgICBzZXRWaWV3OiBmYWxzZSxcbiAgICByZW1haW5BY3RpdmU6IGZhbHNlXG4gIH0pXG4gIC5hZGRUbyhtYXApO1xuY29uc3QgTG9jYXRpb25TdGF0ZSA9IGZ1bmN0aW9uIF9Mb2NhdGlvblN0YXRlKCkge1xuICBsZXQgZGF0YSA9IHtcbiAgICBvcmlnaW46IHtcbiAgICAgIGxhdDogTG9jYXRpb25TdGF0ZS5zdGF0ZS5sYXRcbiAgICB9LFxuICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICBsb246IExvY2F0aW9uU3RhdGUuc3RhdGUubG9uXG4gICAgfVxuICB9O1xuICByZXR1cm4gZGF0YTtcbn07XG5jb25zdCBteWhhbmRsZXIgPSB7XG4gIHNldDogZnVuY3Rpb24ob2JqLCBwcm9wLCB2YWx1ZSkge1xuICAgIG9ialtwcm9wXSA9IHZhbHVlO1xuICB9XG59O1xuXG5Mb2NhdGlvblN0YXRlLnN0YXRlID0gbmV3IFByb3h5KHsgbGF0OiBudWxsLCBsb246IG51bGwgfSwgbXloYW5kbGVyKTtcblxuY29uc3QgZmluZExvY2F0aW9uID0gKCkgPT4ge1xuICBtYXAub24oXCJsb2NhdGlvbmZvdW5kXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBtYXAuZml0Qm91bmRzKGUuYm91bmRzKTtcblxuICAgIGxldCBsYXQgPSBlLmxhdGxuZy5sYXQ7XG5cbiAgICBsZXQgbG9uID0gZS5sYXRsbmcubG5nO1xuXG4gICAgZ2VvanNvbi5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcyA9IFtsb24sIGxhdF07XG5cbiAgICBmZWF0dXJlTGF5ZXIuc2V0R2VvSlNPTihnZW9qc29uKTtcblxuICAgIHZhciBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGxvbkZvcm1cIikuZWxlbWVudHM7XG5cbiAgICBpZiAoaW5wdXRzWzBdLm5vZGVOYW1lID09PSBcIklOUFVUXCIgJiYgaW5wdXRzWzBdLnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIC8vIFVwZGF0ZSB0ZXh0IGlucHV0XG4gICAgICBpbnB1dHNbMF0udmFsdWUgPSBsYXQ7XG4gICAgICBpbnB1dHNbMV0udmFsdWUgPSBsb247XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsb2NhdGlvbkNvbnRyb2wuc3RvcCgpO1xuICAgIH0sIDUwMCk7XG4gIH0pO1xufTtcbmNvbnN0IHRpdGxlID0gJChcInRpdGxlXCIpLmh0bWwoKTtcblxuY29uc3QgcGFnZVRpdGxlID0gdGl0bGUuc2xpY2UoMTEpO1xuXG5cbmxldCBib29rbWFya0NvbnRyb2wgPSBuZXcgTC5Db250cm9sLkJvb2ttYXJrcyh7XG4gIG5hbWU6IHBhZ2VUaXRsZVxufSkuYWRkVG8obWFwKTtcbmZ1bmN0aW9uIGlucHV0Rm9jdXMoeCkge1xuICBpZiAoJChcIiNzZWNvbmRPdXRwdXRcIikuaGFzQ2xhc3MoXCJzZWNvbmRcIikpIHtcbiAgICAkKFwiI3NlY29uZE91dHB1dFwiKVxuICAgICAgLnJlbW92ZUNsYXNzKFwic2Vjb25kXCIpXG4gICAgICAuYWRkQ2xhc3MoXCJmYWRlT3V0XCIpO1xuICAgICQoXCIjZmlyc3RPdXRwdXRcIilcbiAgICAgIC5yZW1vdmVDbGFzcyhcImZpcnN0XCIpXG4gICAgICAuYWRkQ2xhc3MoXCJmYWRlT3V0XCIpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgJChcIiNzZWNvbmRPdXRwdXRcIikuYWRkQ2xhc3MoXCJkLW5vbmVcIik7XG4gICAgICAkKFwiI2ZpcnN0T3V0cHV0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xuICAgIH0sIDIwMDApO1xuICB9XG5cbiAgLy9cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgZmluZExvY2F0aW9uKCk7XG4gIGNvbnN0IG5vcnRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub3J0aFwiKTtcbiAgY29uc3Qgc291dGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvdXRoXCIpO1xuICBjb25zdCBkZWdyZWVzTGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWdyZWVzLWxhdFwiKTtcbiAgY29uc3QgbWludXRlc0xhdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWludXRlcy1sYXRcIik7XG4gIGNvbnN0IHNlY29uZHNMYXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlY29uZHMtbGF0XCIpO1xuXG4gIGNvbnN0IGRlZ3JlZXNMb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZ3JlZXMtbG9uXCIpO1xuICBjb25zdCBtaW51dGVzTG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtaW51dGVzLWxvblwiKTtcbiAgY29uc3Qgc2Vjb25kc0xvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Vjb25kcy1sb25cIik7XG4gIGNvbnN0IGVhc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVhc3RcIik7XG4gIGNvbnN0IHdlc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlc3RcIik7XG4gIGNvbnN0IG91dHB1dElucHV0RmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dHB1dC1maWVsZC1pbnB1dFwiKTtcbiAgY29uc3QgZG1zQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkbXNCdG5cIik7XG4gIGNvbnN0IGRtc0Zvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRtc1wiKTtcblxuICBjb25zdCBsYXRsb25Gb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXRsb25Gb3JtXCIpO1xuXG4gIGZ1bmN0aW9uIEREdG9ETVMobGF0LCBsb24pIHtcbiAgICAvL1xuXG4gICAgbGV0IGxhdGl0dWRlID0gTWF0aC5hYnMobGF0KTtcbiAgICBsZXQgbG9uZ2l0dWRlID0gTWF0aC5hYnMobG9uKTtcbiAgICBsZXQgZExhdCA9IE1hdGguZmxvb3IobGF0aXR1ZGUpO1xuICAgIGxldCBtTGF0ID0gTWF0aC5mbG9vcigobGF0aXR1ZGUgLSBkTGF0KSAqIDYwKTtcblxuICAgIHNMYXQgPSBNYXRoLnJvdW5kKChsYXRpdHVkZSAtIGRMYXQgLSBtTGF0IC8gNjApICogMWUzICogMzYwMCkgLyAxZTM7XG4gICAgZExvbiA9IE1hdGguZmxvb3IobG9uZ2l0dWRlKTtcbiAgICBtTG9uID0gTWF0aC5mbG9vcigobG9uZ2l0dWRlIC0gZExvbikgKiA2MCk7XG4gICAgc0xvbiA9IE1hdGguZmxvb3IoKGxvbmdpdHVkZSAtIGRMb24gLSBtTG9uIC8gNjApICogMWUzICogMzYwMCkgLyAxZTM7XG4gICAgbGV0IGRlZ3JlZXNMYXRpdHVkZSA9IGRMYXQ7XG4gICAgbGV0IG1pbnV0ZXNMYXRpdHVkZSA9IG1MYXQ7XG4gICAgbGV0IHNlY29uZHNMYXRpdHVkZSA9IHNMYXQ7XG4gICAgbGV0IGRlZ3JlZXNMb25naXR1ZGUgPSBkTG9uO1xuICAgIGxldCBtaW51dGVzTG9uZ2l0dWRlID0gbUxvbjtcbiAgICBsZXQgc2Vjb25kc0xvbmdpdHVkZSA9IHNMb247XG5cbiAgICBsZXQgbGF0UmVzdWx0ID0gYCR7ZGVncmVlc0xhdGl0dWRlfcKwICR7bWludXRlc0xhdGl0dWRlfScgJHtzZWNvbmRzTGF0aXR1ZGV9JydgO1xuXG4gICAgbGV0IGxvblJlc3VsdCA9IGAke2RlZ3JlZXNMb25naXR1ZGV9wrAgJHttaW51dGVzTG9uZ2l0dWRlfScgJHtzZWNvbmRzTG9uZ2l0dWRlfScnYDtcbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgbGF0OiB7XG4gICAgICAgIGRlZ3JlZXM6IGRlZ3JlZXNMYXRpdHVkZSxcbiAgICAgICAgbWludXRlczogbWludXRlc0xhdGl0dWRlLFxuICAgICAgICBzZWNvbmRzOiBzZWNvbmRzTGF0aXR1ZGVcbiAgICAgIH0sXG4gICAgICBsb246IHtcbiAgICAgICAgZGVncmVlczogZGVncmVlc0xvbmdpdHVkZSxcbiAgICAgICAgbWludXRlczogbWludXRlc0xvbmdpdHVkZSxcbiAgICAgICAgc2Vjb25kczogc2Vjb25kc0xvbmdpdHVkZVxuICAgICAgfSxcbiAgICAgIHBvcHVwTWVzc2FnZTogeyBsYXQ6IGxhdFJlc3VsdCwgbG9uOiBsb25SZXN1bHQgfVxuICAgIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjaGVjayhlbG0pIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbG0pLmNoZWNrZWQgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgY29udmVydExvY2F0aW9uRGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udmVydExvY2F0aW9uRGF0YVwiKTtcbiAgY29uc3QgbGF0SW5wdXRGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGF0SW5wdXRGaWVsZFwiKTtcbiAgY29uc3QgbG9uSW5wdXRGaWVsZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9uSW5wdXRGaWVsZFwiKTtcbiAgY29uc3QgbGF0bG9uR2VvY29kZXJCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGxvbkdlb2NvZGVyQnRuXCIpO1xuXG4gIGNvbnN0IEFwcCA9IGZ1bmN0aW9uIF9BcHAoKSB7XG4gICAgcmV0dXJuIGBcbiAgIDxoMT5HbG9iYWwgU3RhdGUgPSBbJHtBcHAuc3RhdGUuY291bnR9XSA8L2gxPlxuICBgO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihvYmosIHByb3AsIHZhbHVlKSB7XG4gICAgICBvYmpbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgQXBwLnN0YXRlID0gbmV3IFByb3h5KHsgY291bnQ6IDAgfSwgaGFuZGxlcik7XG5cbiAgLy8gSW5pdGlhbCBMb2FkaW5nIG9mIHRoZSBBcHBcblxuICBjb25zdCBDb29yZHNBcHAgPSBmdW5jdGlvbiBfQ29vcmRzQXBwKCkge1xuICAgIHJldHVybiBgXG4gICA8aDE+T3JpZ2luIFN0YXRlID0gWyR7Q29vcmRzQXBwLnN0YXRlLm9yaWdpbn1dIDwvaDE+IDwvYnI+XG4gICA8aDE+RGVzdGluYXRpb24gU3RhdGUgPSBbJHtDb29yZHNBcHAuc3RhdGUuZGVzdGluYXRpb259XSA8L2gxPlxuICAgPGgxPlVzZXIgTG9jYXRpb24gPSBbJHtDb29yZHNBcHAuc3RhdGUudXNlckxvY2F0aW9ufV0gPC9oMT5cbiAgIDxoMT50cmFja2luZ1VzZXIgPSAgJHtDb29yZHNBcHAuc3RhdGUudHJhY2tpbmdVc2VyfTwvaDE+XG4gIGA7XG4gIH07XG5cbiAgY29uc3QgbXloYW5kbGVyID0ge1xuICAgIHNldDogZnVuY3Rpb24ob2JqLCBwcm9wLCB2YWx1ZSkge1xuICAgICAgb2JqW3Byb3BdID0gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIENvb3Jkc0FwcC5zdGF0ZSA9IG5ldyBQcm94eShcbiAgICB7IG9yaWdpbjogW10sIGRlc3RpbmF0aW9uOiBbXSwgdXNlckxvY2F0aW9uOiBbXSB9LFxuICAgIG15aGFuZGxlclxuICApO1xuXG4gICQoXCIjb3JpZ2luVGVzdFwiKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgJChcIiNkZXN0aW5hdGlvblRlc3RcIikuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgfSk7XG4gICQoXCIjc3dpdGNoVGVzdFwiKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9KTtcbiAgZnVuY3Rpb24gYWRkUm91dGUoKSB7XG4gICAgQXBwLnN0YXRlLmNvdW50Kys7XG5cbiAgICBjb25zdCBvcmlnaW4gPSBDb29yZHNBcHAuc3RhdGUub3JpZ2luO1xuXG4gICAgY29uc3QgZGVzdGluYXRpb24gPSBDb29yZHNBcHAuc3RhdGUuZGVzdGluYXRpb247XG5cbiAgICAvL21hcC5mbHlUbyhbY2VudGVyTGF0LCBjZW50ZXJMb25dKVxuICAgIC8qIG1hcC5wYW5JbnNpZGVCb3VuZHMoW1xuICAgICAgICAgW29yaWdpblsxXSAsIG9yaWdpblswXSBdLCAvLyBzb3V0aHdlc3Rlcm4gY29ybmVyIG9mIHRoZSBib3VuZHNcbiAgICAgICAgIFtkZXN0aW5hdGlvblsxXSAsIGRlc3RpbmF0aW9uWzBdLCB7cGFkZGluZzogWzUwLDUwXX0gXSAvLyBub3J0aGVhc3Rlcm4gY29ybmVyIG9mIHRoZSBib3VuZHNcbiAgICAgICBdKTtcbiAgICAgICAvL1xuXG4gICAgICBnZW9qc29uLmZlYXR1cmVzWzBdLmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gW29yaWdpblswXSwgb3JpZ2luWzFdXTtcbiAgICAgIGdlb2pzb24uZmVhdHVyZXNbMV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBbZGVzdGluYXRpb25bMF0sIGRlc3RpbmF0aW9uWzFdXVxuXG4gICovXG4gICAgLy9cbiAgICBsZXQgbGF0RCA9IGRlc3RpbmF0aW9uWzFdO1xuICAgIGxldCBsb25EID0gZGVzdGluYXRpb25bMF07XG4gICAgbGV0IGxhdE8gPSBvcmlnaW5bMV07XG4gICAgbGV0IGxvbk8gPSBvcmlnaW5bMF07XG4gICAgZ2VvanNvbi5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcyA9IFtsb25PLCBsYXRPXTtcbiAgICBnZW9qc29uLmZlYXR1cmVzWzFdLmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gW2xvbkQsIGxhdERdO1xuICAgIC8vXG4gICAgZmVhdHVyZUxheWVyLnNldEdlb0pTT04oZ2VvanNvbik7XG5cbiAgICAvL2ZlYXR1cmVMYXllci5zZXRHZW9KU09OKGdlb2pzb24pLmFkZFRvKG1hcCk7XG5cbiAgICAvKlxuICAgICAgbWFwLmZpdEJvdW5kcyhmZWF0dXJlTGF5ZXIuZ2V0Qm91bmRzKCksIHtcbiAgcGFkZGluZzogWzUwLDUwXVxuXG4gICAgICB9KTtcbiAgICAgIG1hcC56b29tT3V0KClcbiAgKi9cblxuICAgIGxldCBsYXRPcmlnaW4gPSBvcmlnaW5bMV07XG4gICAgbGV0IGxvbk9yaWdpbiA9IG9yaWdpblswXTtcbiAgICBsZXQgbGF0RGVzdCA9IGRlc3RpbmF0aW9uWzFdO1xuICAgIGxldCBsb25EZXN0ID0gZGVzdGluYXRpb25bMF07XG4gICAgLy9cbiAgICBtYXAuZml0Qm91bmRzKFxuICAgICAgW1xuICAgICAgICBbbGF0T3JpZ2luLCBsb25PcmlnaW5dLFxuICAgICAgICBbbGF0RGVzdCwgbG9uRGVzdF1cbiAgICAgIF0sXG4gICAgICB7IHBhZGRpbmc6IFs1MCwgNTBdIH1cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkTmV3Um91dGUoKSB7XG4gICAgY29uc3Qgb3JpZ2luID0gQ29vcmRzQXBwLnN0YXRlLm9yaWdpbjtcblxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gQ29vcmRzQXBwLnN0YXRlLmRlc3RpbmF0aW9uO1xuICAgIGxldCBsYXREID0gZGVzdGluYXRpb25bMV07XG4gICAgbGV0IGxvbkQgPSBkZXN0aW5hdGlvblswXTtcbiAgICBsZXQgbGF0TyA9IG9yaWdpblsxXTtcbiAgICBsZXQgbG9uTyA9IG9yaWdpblswXTtcbiAgICBnZW9qc29uLmZlYXR1cmVzWzBdLmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gW2xvbk8sIGxhdE9dO1xuICAgIGdlb2pzb24uZmVhdHVyZXNbMV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBbbG9uRCwgbGF0RF07XG5cbiAgICBmZWF0dXJlTGF5ZXIuc2V0R2VvSlNPTihnZW9qc29uKTtcbiAgICAvLyBBIHNpbXBsZSBsaW5lIGZyb20gb3JpZ2luIHRvIGRlc3RpbmF0aW9uLlxuXG4gICAgLy8gQSBzaW5nbGUgcG9pbnQgdGhhdCBhbmltYXRlcyBhbG9uZyB0aGUgcm91dGUuXG4gICAgLy8gQ29vcmRpbmF0ZXMgYXJlIGluaXRpYWxseSBzZXQgdG8gb3JpZ2luLlxuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBpbiBraWxvbWV0ZXJzIGJldHdlZW4gcm91dGUgc3RhcnQvZW5kIHBvaW50LlxuXG4gICAgLy8gYW5pbWF0ZShjb3VudGVyKTtcbiAgICBmZWF0dXJlTGF5ZXIuc2V0R2VvSlNPTihnZW9qc29uKTtcblxuICAgIGxldCBsYXRPcmlnaW4gPSBvcmlnaW5bMV07XG4gICAgbGV0IGxvbk9yaWdpbiA9IG9yaWdpblswXTtcbiAgICBsZXQgbGF0RGVzdCA9IGRlc3RpbmF0aW9uWzFdO1xuICAgIGxldCBsb25EZXN0ID0gZGVzdGluYXRpb25bMF07XG4gICAgLy9cbiAgICBtYXAuZml0Qm91bmRzKFxuICAgICAgW1xuICAgICAgICBbbGF0T3JpZ2luLCBsb25PcmlnaW5dLFxuICAgICAgICBbbGF0RGVzdCwgbG9uRGVzdF1cbiAgICAgIF0sXG4gICAgICB7XG4gICAgICAgIHBhZGRpbmc6IFs1MCwgNTBdXG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdCh0aW1lKSB7XG4gICAgLy8gSG91cnMsIG1pbnV0ZXMgYW5kIHNlY29uZHNcbiAgICB2YXIgaHJzID0gfn4odGltZSAvIDM2MDApO1xuICAgIHZhciBtaW5zID0gfn4oKHRpbWUgJSAzNjAwKSAvIDYwKTtcblxuICAgIGxldCByZXN1bHQgPSB7XG4gICAgICBob3VyczogaHJzLFxuICAgICAgbWludXRlczogbWluc1xuICAgIH07XG4gICAgLy8gT3V0cHV0IGxpa2UgXCIxOjAxXCIgb3IgXCI0OjAzOjU5XCIgb3IgXCIxMjM6MDM6NTlcIlxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYWxsTWF0cml4KGZpcnN0LCBzZWNvbmQpIHtcbiAgICBmZXRjaChcbiAgICAgIGBodHRwczovL2FwaS5tYXBib3guY29tL2RpcmVjdGlvbnMtbWF0cml4L3YxL21hcGJveC9kcml2aW5nLyR7Zmlyc3R9OyR7c2Vjb25kfT8mYWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pYkc5bllXNDFNakF4SWl3aVlTSTZJbU5yY1RReWNubGhNREJsYjJreWRYQndaSG95T0dOc1kzRWlmUS5FOE40bFB5NnRpSTB4WTNub3IzTVRnYFxuICAgIClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICBjb25zdCBkdXJhdGlvbnMgPSBqc29uLmR1cmF0aW9uc1swXTtcbiAgICAgICAgY29uc3QgdHJhdmVsVGltZSA9IGR1cmF0aW9uc1sxXTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZm9ybWF0KHRyYXZlbFRpbWUpO1xuICAgICAgICAvLyAvL1xuXG4gICAgICAgIHZhciBhbGVydFBsYWNlaG9sZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXZlQWxlcnRQbGFjZWhvbGRlclwiKTtcbiAgICAgICAgdmFyIGFsZXJ0VHJpZ2dlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGl2ZUFsZXJ0QnRuXCIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHBvc3RMb2cobWVzc2FnZSkge1xuICAgICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICB3cmFwcGVyLmlubmVySFRNTCA9IGBcbiAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtc2Vjb25kYXJ5IGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWJldHdlZW5cIiByb2xlPVwiYWxlcnRcIj5cbiAgICAgPGRpdiBjbGFzcz1cImFsZXJ0TWVzc2FnZVwiPlxuICAgICAgICR7bWVzc2FnZX1cbiAgICAgPC9kaXY+XG5cblxuICAgPC9kaXY+YDtcblxuICAgICAgICAgIGFsZXJ0UGxhY2Vob2xkZXIuYXBwZW5kKHdyYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGVydFBsYWNlaG9sZGVyLmNoaWxkRWxlbWVudENvdW50ID09IDApIHtcbiAgICAgICAgICBwb3N0TG9nKGAke3Jlc3VsdC5ob3Vyc30gaG91cihzKSBhbmQgJHtyZXN1bHQubWludXRlc30gbWludXRlc2ApO1xuICAgICAgICB9IGVsc2UgaWYgKGFsZXJ0UGxhY2Vob2xkZXIuY2hpbGRFbGVtZW50Q291bnQgPT0gMSkge1xuICAgICAgICAgIHBvc3RMb2coYCR7cmVzdWx0LmhvdXJzfSBob3VyKHMpIGFuZCAke3Jlc3VsdC5taW51dGVzfSBtaW51dGVzYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYWxlcnRQbGFjZWhvbGRlci5jaGlsZEVsZW1lbnRDb3VudCA9PSAyKSB7XG4gICAgICAgICAgJChcIiNsaXZlQWxlcnRQbGFjZWhvbGRlclwiKS5lbXB0eSgpO1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcG9zdExvZyhgJHtyZXN1bHQuaG91cnN9IGhvdXIocykgYW5kICR7cmVzdWx0Lm1pbnV0ZXN9YCk7XG4gICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAkKFwiI2xhdGxvbkZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgaW5wdXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXRsb25Gb3JtXCIpLmVsZW1lbnRzO1xuXG4gICAgbGV0IGxhdE8gPSBpbnB1dHNbMF0udmFsdWU7XG4gICAgbGV0IGxvbk8gPSBpbnB1dHNbMV0udmFsdWU7XG4gICAgbGV0IGxhdEQgPSBpbnB1dHNbMl0udmFsdWU7XG4gICAgbGV0IGxvbkQgPSBpbnB1dHNbM10udmFsdWU7XG4gICAgZ2VvanNvbi5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcyA9IFtsb25PLCBsYXRPXTtcbiAgICBnZW9qc29uLmZlYXR1cmVzWzFdLmdlb21ldHJ5LmNvb3JkaW5hdGVzID0gW2xvbkQsIGxhdERdO1xuICAgIGZlYXR1cmVMYXllci5zZXRHZW9KU09OKGdlb2pzb24pO1xuXG4gICAgbGV0IG9yaWdpbiA9IFtsYXRPLCBsb25EXTtcbiAgICBsZXQgZGVzdGluYXRpb24gPSBbbGF0RCwgbG9uRF07XG4gICAgY29uc3QgcG9pbnRzID0gW1xuICAgICAge1xuICAgICAgICBsYXRpdHVkZTogbGF0TyxcbiAgICAgICAgbG9uZ2l0dWRlOiBsb25PXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYXRpdHVkZTogbGF0RCxcbiAgICAgICAgbG9uZ2l0dWRlOiBsb25EXG4gICAgICB9XG4gICAgXTtcblxuICAgIGNvbnN0IGRpc3RhbmNlID0gSGF2ZXJzaW5lR2VvbG9jYXRpb24uZ2V0RGlzdGFuY2VCZXR3ZWVuKFxuICAgICAgcG9pbnRzWzBdLFxuICAgICAgcG9pbnRzWzFdLFxuICAgICAgXCJtaVwiXG4gICAgKTtcblxuICAgICQoXCIjZGlzdGFuY2VJbnB1dFwiKS52YWwoYCR7ZGlzdGFuY2V9IG1pbGVzYCk7XG4gICAgbWFwLmZpdEJvdW5kcyhcbiAgICAgIFtcbiAgICAgICAgW2xhdE8sIGxvbk9dLFxuICAgICAgICBbbGF0RCwgbG9uRF1cbiAgICAgIF0sXG4gICAgICB7IHBhZGRpbmc6IFs1MCwgNTBdIH1cbiAgICApO1xuICB9KTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBTkE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFOQTtBQWpCQTtBQWtDQTtBQUNBO0FBR0E7QUFJQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQVBBO0FBQ0E7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQURBO0FBSkE7QUFRQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBTUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFBQTtBQUFBO0FBQUE7QUFYQTtBQWFBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQURBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFGQTtBQU1BO0FBTUE7QUFDQTtBQUtBO0FBQUE7QUFFQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/latlonDistance.js\n");

/***/ }),

/***/ 2:
/*!****************************************!*\
  !*** multi ./src/js/latlonDistance.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/js/latlonDistance.js */"./src/js/latlonDistance.js");


/***/ })

/******/ });