

import "picturefill";
import "utils/errors";
import { movieData } from "utils/autocompletedata"
import {autocompleteInit} from "utils/autocomplete"
import {initBootstrap} from "./bootstrap";

const data = movieData()
window.addEventListener("DOMContentLoaded", (event) => {
  const body = document.querySelector("body")
  autocompleteInit(data)
  if(body.classList.contains("film-details")){
  initBootstrap({
 
  collapse: true,
});

 

     

 

  }

 })

