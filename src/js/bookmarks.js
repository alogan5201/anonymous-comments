/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import "./firebase"

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
console.log('index page loaded')
const d= [
  {
    "name": "2232 Dunseath Avenue Northwest, Atlanta, Georgia 30318, United States",
    "lat": 33.816576,
    "lon": -84.4496896,
    "dmslat": "33° 48' 59.674''",
    "dmslon": "84° 26' 58.882''",
    "weather": null,
    "path": "/address-to-latlon/",
    "uid": "0520b04b-282f-4419-baae-56fbd3f0d069",
    "date": "Apr 2022"
  },
  {
    "name": "2232 Dunseath Avenue Northwest, Atlanta, Georgia 30318, United States",
    "lat": 33.816576,
    "lon": -84.4496896,
    "dmslat": "33° 48' 59.674''",
    "dmslon": "84° 26' 58.882''",
    "weather": null,
    "path": "/lat-lon-to-address/",
    "uid": "a97b7bf5-1e8d-4315-91db-74b66f4066ee",
    "date": "Apr 2022"
  },
  {
    "name": null,
    "lat": 33.816576,
    "lon": -84.4496896,
    "dmslat": "33° 48'59.674''",
    "dmslon": "84° 26'58.882''",
    "weather": null,
    "path": "/dms-to-latlon/",
    "uid": "1a36cff5-bfb7-4e52-aabd-7cfbf6459761",
    "date": "Apr 2022"
  }
]


function helloWorld () {


  const grid = new Grid({
    search: true,
  columns: [{
     id: 'name',
     name: 'Name'
  }, {
     id: 'email',
     name: 'Email'
  }, {
     id: 'phoneNumber',
     name: 'Phone Number'
  }],
  data: [
    { name: 'John', email: 'john@example.com', phoneNumber: '(353) 01 222 3333' },
    { name: 'Mark', email: 'mark@gmail.com', phoneNumber: '(01) 22 888 4444' },
  ]
})
.render(document.getElementById("grid-wrapper"));


   return grid;
}

helloWorld()
  // Movie Directory
});
