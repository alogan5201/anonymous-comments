/*!
* GeoTools
* Boilerplate for a Static website using EJS and SASS
* example.com
* @author Brenton Cozby -- https://brentoncozby.com
* Copyright 2022. MIT Licensed.
*/

!function(n){function e(e){for(var o,r,i=e[0],l=e[1],d=e[2],c=0,p=[];c<i.length;c++)r=i[c],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&p.push(a[r][0]),a[r]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(n[o]=l[o]);for(u&&u(e);p.length;)p.shift()();return s.push.apply(s,d||[]),t()}function t(){for(var n,e=0;e<s.length;e++){for(var t=s[e],o=!0,i=1;i<t.length;i++){var l=t[i];0!==a[l]&&(o=!1)}o&&(s.splice(e--,1),n=r(r.s=t[0]))}return n}var o={},a={4:0},s=[];function r(e){if(o[e])return o[e].exports;var t=o[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.m=n,r.c=o,r.d=function(n,e,t){r.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:t})},r.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},r.t=function(n,e){if(1&e&&(n=r(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var o in n)r.d(t,o,function(e){return n[e]}.bind(null,o));return t},r.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(e,"a",e),e},r.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},r.p="/js/";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=e,i=i.slice();for(var d=0;d<i.length;d++)e(i[d]);var u=l;s.push([20,0]),t()}({20:function(module,exports,__webpack_require__){eval("module.exports = __webpack_require__(21);\n\n\n//# sourceURL=webpack:///multi_./src/js/latlonDistance.js?")},21:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var haversine_geolocation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);\n/* harmony import */ var haversine_geolocation__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(haversine_geolocation__WEBPACK_IMPORTED_MODULE_0__);\n/*jshint esversion: 8 */\n\nconst geojson = {\n  type: "FeatureCollection",\n  features: [{\n    type: "Feature",\n    geometry: {\n      type: "Point",\n      coordinates: [0, 0]\n    },\n    properties: {\n      title: "Mapbox DC",\n      description: "1714 14th St NW, Washington DC",\n      "marker-color": "#35A2D1",\n      "marker-size": "large",\n      "marker-symbol": "1"\n    }\n  }, {\n    type: "Feature",\n    geometry: {\n      type: "Point",\n      coordinates: [0, 0]\n    },\n    properties: {\n      title: "Mapbox SF",\n      description: "155 9th St, San Francisco",\n      "marker-color": "#fc4353",\n      "marker-size": "large",\n      "marker-symbol": "2"\n    }\n  }]\n};\nconst map = L.mapbox.map("map").setView([37.9, -77], 6);\nL.mapbox.accessToken = "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";\nconst layer = L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11").addTo(map); // add your tiles to the map\n// L.marker is a low-level marker constructor in Leaflet.\n\nvar featureLayer = L.mapbox.featureLayer().addTo(map);\nvar locationControl = L.control.locate({\n  circleStyle: {\n    opacity: 0\n  },\n  followCircleStyle: {\n    opacity: 0\n  },\n  drawCircle: false,\n  follow: false,\n  icon: "fas fa-map-marker-alt",\n  // follow the user\'s location\n  setView: false,\n  remainActive: false\n}).addTo(map);\n\nconst LocationState = function _LocationState() {\n  let data = {\n    origin: {\n      lat: LocationState.state.lat\n    },\n    destination: {\n      lon: LocationState.state.lon\n    }\n  };\n  return data;\n};\n\nconst myhandler = {\n  set: function (obj, prop, value) {\n    obj[prop] = value;\n  }\n};\nLocationState.state = new Proxy({\n  lat: null,\n  lon: null\n}, myhandler);\n\nconst findLocation = () => {\n  map.on("locationfound", function (e) {\n    map.fitBounds(e.bounds);\n    let lat = e.latlng.lat;\n    let lon = e.latlng.lng;\n    geojson.features[0].geometry.coordinates = [lon, lat];\n    featureLayer.setGeoJSON(geojson);\n    var inputs = document.getElementById("latlonForm").elements;\n\n    if (inputs[0].nodeName === "INPUT" && inputs[0].type === "number") {\n      // Update text input\n      inputs[0].value = lat;\n      inputs[1].value = lon;\n    }\n\n    setTimeout(() => {\n      locationControl.stop();\n    }, 500);\n  });\n};\n\nconst title = $("title").html();\nconst pageTitle = title.slice(11);\nlet bookmarkControl = new L.Control.Bookmarks({\n  name: pageTitle\n}).addTo(map);\n\nfunction inputFocus(x) {\n  if ($("#secondOutput").hasClass("second")) {\n    $("#secondOutput").removeClass("second").addClass("fadeOut");\n    $("#firstOutput").removeClass("first").addClass("fadeOut");\n    setTimeout(() => {\n      $("#secondOutput").addClass("d-none");\n      $("#firstOutput").addClass("d-none");\n    }, 2000);\n  } //\n\n}\n\nwindow.addEventListener("DOMContentLoaded", () => {\n  findLocation();\n  const north = document.getElementById("north");\n  const south = document.getElementById("south");\n  const degreesLat = document.getElementById("degrees-lat");\n  const minutesLat = document.getElementById("minutes-lat");\n  const secondsLat = document.getElementById("seconds-lat");\n  const degreesLon = document.getElementById("degrees-lon");\n  const minutesLon = document.getElementById("minutes-lon");\n  const secondsLon = document.getElementById("seconds-lon");\n  const east = document.getElementById("east");\n  const west = document.getElementById("west");\n  const outputInputField = document.getElementById("output-field-input");\n  const dmsBtn = document.getElementById("dmsBtn");\n  const dmsForm = document.getElementById("dms");\n  const latlonForm = document.getElementById("latlonForm");\n\n  function DDtoDMS(lat, lon) {\n    //\n    let latitude = Math.abs(lat);\n    let longitude = Math.abs(lon);\n    let dLat = Math.floor(latitude);\n    let mLat = Math.floor((latitude - dLat) * 60);\n    sLat = Math.round((latitude - dLat - mLat / 60) * 1e3 * 3600) / 1e3;\n    dLon = Math.floor(longitude);\n    mLon = Math.floor((longitude - dLon) * 60);\n    sLon = Math.floor((longitude - dLon - mLon / 60) * 1e3 * 3600) / 1e3;\n    let degreesLatitude = dLat;\n    let minutesLatitude = mLat;\n    let secondsLatitude = sLat;\n    let degreesLongitude = dLon;\n    let minutesLongitude = mLon;\n    let secondsLongitude = sLon;\n    let latResult = `${degreesLatitude}° ${minutesLatitude}\' ${secondsLatitude}\'\'`;\n    let lonResult = `${degreesLongitude}° ${minutesLongitude}\' ${secondsLongitude}\'\'`;\n    let result = {\n      lat: {\n        degrees: degreesLatitude,\n        minutes: minutesLatitude,\n        seconds: secondsLatitude\n      },\n      lon: {\n        degrees: degreesLongitude,\n        minutes: minutesLongitude,\n        seconds: secondsLongitude\n      },\n      popupMessage: {\n        lat: latResult,\n        lon: lonResult\n      }\n    };\n    return result;\n  }\n\n  function check(elm) {\n    document.getElementById(elm).checked = true;\n  }\n\n  const convertLocationData = document.getElementById("convertLocationData");\n  const latInputField = document.getElementById("latInputField");\n  const lonInputField = document.getElementById("lonInputField");\n  const latlonGeocoderBtn = document.getElementById("latlonGeocoderBtn");\n\n  const App = function _App() {\n    return `\n   <h1>Global State = [${App.state.count}] </h1>\n  `;\n  };\n\n  const handler = {\n    set: function (obj, prop, value) {\n      obj[prop] = value;\n    }\n  };\n  App.state = new Proxy({\n    count: 0\n  }, handler); // Initial Loading of the App\n\n  const CoordsApp = function _CoordsApp() {\n    return `\n   <h1>Origin State = [${CoordsApp.state.origin}] </h1> </br>\n   <h1>Destination State = [${CoordsApp.state.destination}] </h1>\n   <h1>User Location = [${CoordsApp.state.userLocation}] </h1>\n   <h1>trackingUser =  ${CoordsApp.state.trackingUser}</h1>\n  `;\n  };\n\n  const myhandler = {\n    set: function (obj, prop, value) {\n      obj[prop] = value;\n    }\n  };\n  CoordsApp.state = new Proxy({\n    origin: [],\n    destination: [],\n    userLocation: []\n  }, myhandler);\n  $("#originTest").click(function (e) {\n    e.preventDefault();\n  });\n  $("#destinationTest").click(function (e) {\n    e.preventDefault();\n  });\n  $("#switchTest").click(function (e) {\n    e.preventDefault();\n  });\n\n  function addRoute() {\n    App.state.count++;\n    const origin = CoordsApp.state.origin;\n    const destination = CoordsApp.state.destination; //map.flyTo([centerLat, centerLon])\n\n    /* map.panInsideBounds([\n         [origin[1] , origin[0] ], // southwestern corner of the bounds\n         [destination[1] , destination[0], {padding: [50,50]} ] // northeastern corner of the bounds\n       ]);\n       //\n       geojson.features[0].geometry.coordinates = [origin[0], origin[1]];\n      geojson.features[1].geometry.coordinates = [destination[0], destination[1]]\n    */\n    //\n\n    let latD = destination[1];\n    let lonD = destination[0];\n    let latO = origin[1];\n    let lonO = origin[0];\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD]; //\n\n    featureLayer.setGeoJSON(geojson); //featureLayer.setGeoJSON(geojson).addTo(map);\n\n    /*\n      map.fitBounds(featureLayer.getBounds(), {\n    padding: [50,50]\n       });\n      map.zoomOut()\n    */\n\n    let latOrigin = origin[1];\n    let lonOrigin = origin[0];\n    let latDest = destination[1];\n    let lonDest = destination[0]; //\n\n    map.fitBounds([[latOrigin, lonOrigin], [latDest, lonDest]], {\n      padding: [50, 50]\n    });\n  }\n\n  function addNewRoute() {\n    const origin = CoordsApp.state.origin;\n    const destination = CoordsApp.state.destination;\n    let latD = destination[1];\n    let lonD = destination[0];\n    let latO = origin[1];\n    let lonO = origin[0];\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD];\n    featureLayer.setGeoJSON(geojson); // A simple line from origin to destination.\n    // A single point that animates along the route.\n    // Coordinates are initially set to origin.\n    // Calculate the distance in kilometers between route start/end point.\n    // animate(counter);\n\n    featureLayer.setGeoJSON(geojson);\n    let latOrigin = origin[1];\n    let lonOrigin = origin[0];\n    let latDest = destination[1];\n    let lonDest = destination[0]; //\n\n    map.fitBounds([[latOrigin, lonOrigin], [latDest, lonDest]], {\n      padding: [50, 50]\n    });\n  }\n\n  function format(time) {\n    // Hours, minutes and seconds\n    var hrs = ~~(time / 3600);\n    var mins = ~~(time % 3600 / 60);\n    let result = {\n      hours: hrs,\n      minutes: mins\n    }; // Output like "1:01" or "4:03:59" or "123:03:59"\n\n    return result;\n  }\n\n  function callMatrix(first, second) {\n    fetch(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${first};${second}?&access_token=pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQycnlhMDBlb2kydXBwZHoyOGNsY3EifQ.E8N4lPy6tiI0xY3nor3MTg`).then(response => response.json()).then(json => {\n      const durations = json.durations[0];\n      const travelTime = durations[1];\n      const result = format(travelTime); // //\n\n      var alertPlaceholder = document.getElementById("liveAlertPlaceholder");\n      var alertTrigger = document.getElementById("liveAlertBtn");\n\n      function postLog(message) {\n        var wrapper = document.createElement("div");\n        wrapper.innerHTML = `\n    <div class="alert alert-secondary d-flex align-items-center justify-content-between" role="alert">\n     <div class="alertMessage">\n       ${message}\n     </div>\n\n\n   </div>`;\n        alertPlaceholder.append(wrapper);\n      }\n\n      if (alertPlaceholder.childElementCount == 0) {\n        postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);\n      } else if (alertPlaceholder.childElementCount == 1) {\n        postLog(`${result.hours} hour(s) and ${result.minutes} minutes`);\n      } else if (alertPlaceholder.childElementCount == 2) {\n        $("#liveAlertPlaceholder").empty();\n        setTimeout(() => {\n          postLog(`${result.hours} hour(s) and ${result.minutes}`);\n        }, 200);\n      }\n    });\n  }\n\n  $("#latlonForm").on("submit", function (e) {\n    e.preventDefault();\n    let inputs = document.getElementById("latlonForm").elements;\n    let latO = inputs[0].value;\n    let lonO = inputs[1].value;\n    let latD = inputs[2].value;\n    let lonD = inputs[3].value;\n    geojson.features[0].geometry.coordinates = [lonO, latO];\n    geojson.features[1].geometry.coordinates = [lonD, latD];\n    featureLayer.setGeoJSON(geojson);\n    let origin = [latO, lonD];\n    let destination = [latD, lonD];\n    const points = [{\n      latitude: latO,\n      longitude: lonO\n    }, {\n      latitude: latD,\n      longitude: lonD\n    }];\n    const distance = haversine_geolocation__WEBPACK_IMPORTED_MODULE_0___default.a.getDistanceBetween(points[0], points[1], "mi");\n    $("#distanceInput").val(`${distance} miles`);\n    map.fitBounds([[latO, lonO], [latD, lonD]], {\n      padding: [50, 50]\n    });\n  });\n});\n\n//# sourceURL=webpack:///./src/js/latlonDistance.js?')}});