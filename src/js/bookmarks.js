/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import "./firebase";

import "picturefill";
import "utils/errors";
import { Grid, html } from "gridjs";

/*
var dropdownElementList = [].slice.call(
  document.querySelectorAll(".nav-bar-toggle")
);
var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
  return new Dropdown(dropdownToggleEl);
});
*/
let url = window.location.href;
Date.prototype.toShortFormat = function () {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${monthName} ${year}`;
};

let today = new Date();

const prettyDate = today.toShortFormat();

//const functions = getFunctions(app);

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("index page loaded");
  const d = [
    {
      name: "s",
      address:
        "2048 Bolton Drive Northwest, Atlanta, Georgia 30318, United States",
      lat: 33.81418,
      lon: -84.43854,
      dms: {
        lat: "33° 48' 50.812''",
        lon: "84° 26' 19.529''",
      },
      weather: null,
      path: "/travel/",
      uid: "97e9b3b8-c9f9-4712-b292-a7c03a9caaf7",
      date: "Apr 2022",
      altitude: null,
      bookmarked: true,
    },
    {
      name: "s",
      address:
        "2048 Bolton Drive Northwest, Atlanta, Georgia 30318, United States",
      lat: 33.81418,
      lon: -84.43854,
      dms: {
        lat: "33° 48' 50.791''",
        lon: "84° 26' 19.602''",
      },
      weather: null,
      path: "/travel/",
      uid: "74d3b708-e377-4d1a-9960-03ad9e684453",
      date: "Apr 2022",
      altitude: "250 meters",
      bookmarked: true,
    },
    {
      name: "austin",
      address: "Austin, Texas, United States",
      lat: 30.2711,
      lon: -97.7437,
      dms: {
        lat: "30° 16' 15.96''",
        lon: "97° 44' 37.32''",
      },
      weather: null,
      path: "/travel/",
      uid: "438ca9ff-5862-42a1-8cdf-6d3809e7c363",
      date: "Apr 2022",
      altitude: "160 meters",
      bookmarked: true,
    },
  ];

  let x = {
    name: "s",
    address:
      "2048 Bolton Drive Northwest, Atlanta, Georgia 30318, United States",
    lat: 33.81418,
    lon: -84.43854,
    dms: {
      lat: "33° 48' 50.812''",
      lon: "84° 26' 19.529''",
    },
    path: "/travel/",
    uid: "97e9b3b8-c9f9-4712-b292-a7c03a9caaf7",
    date: "Apr 2022",
    bookmarked: true,
  };
  const removeNullUndefined = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

  function helloWorld() {
    let savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    let arr = [];
    if (savedBookmarks) {
      for (let index = 0; index < savedBookmarks.length; index++) {
        const element = savedBookmarks[index];
        const newelm = removeNullUndefined(element);
        arr.push(newelm);
      }
      console.log(arr);
      const grid = new Grid({
        search: true,
        pagination: true,
        columns: [
          {
            id: "name",
            name: "Name",
            formatter: (cell) => html(`<a href='#'>${cell}</a>`),
          },
          {
            id: "address",
            name: "Address",
            formatter: (cell) => html(`<a href='#'>${cell}</a>`),
          },
          {
            id: "date",
            name: "date",
            formatter: (cell) => html(`<a href='#'>${cell}</a>`),
          },
          {
            id: "lat",
            name: "Latitude",
            formatter: (cell) => html(`<a href='#'>${cell}</a>`),
          },
          {
            id: "lon",
            name: "Longitude",
            formatter: (cell) => html(`<a href='#'>${cell}</a>`),
          },
        ],
        data: arr,
      }).render(document.getElementById("grid-wrapper"));

      return grid;
    }
  }

  helloWorld();

  L.mapbox.accessToken =
    "pk.eyJ1IjoibG9nYW41MjAxIiwiYSI6ImNrcTQybTFoZzE0aDQyeXM1aGNmYnR1MnoifQ.4kRWNfEH_Yao_mmdgrgjPA";

  var mapboxTiles = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" +
      L.mapbox.accessToken,
    {
      attribution:
        '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileSize: 512,
      zoomOffset: -1,
    }
  );

  const map = L.map("map")
    .addLayer(mapboxTiles)
    .setView([42.361, -71.0587], 15);
});
