import {movieData} from "utils/autocompletedata"
import {autocompleteInit} from "utils/autocomplete"


const data = movieData()
window.addEventListener("DOMContentLoaded", (event) => {

  autocompleteInit(data)


 })

