/** letiables available in all js files:
 * all the exported constants from globals.js
 */

/** Directories available as aliases
 * all the paths within Dir in globals.js
 */

import "./firebase"

import "picturefill";
import "utils/errors";


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


  // Movie Directory
});
