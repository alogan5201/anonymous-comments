/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import "./firebase";

import "picturefill";
import "utils/errors";
import { Grid } from "gridjs";

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
    let arr = [];
    for (let index = 0; index < d.length; index++) {
      const element = d[index];
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
        },
        {
          id: "address",
          name: "Address",
        },
        {
          id: "date",
          name: "date",
        },
        {
          id: "lat",
          name: "Latitude",
        },
        {
          id: "lon",
          name: "Longitude",
        },
      ],
      data: arr,
    }).render(document.getElementById("grid-wrapper"));

    return grid;
  }

  helloWorld();
  // Movie Directory
});
