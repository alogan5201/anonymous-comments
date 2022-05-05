'use strict';

// =============== Autocomplete for input fields =====================

/**
 * Description : Add an autocomplete list to an input field with bootstrap style.
 * @param {[string]} id_formfield [ID from form element where an autocomplete list should added]
 * @param {[string]} id_autocomplete_div []
 * @param {Array]} result_list [Array of all possible search results]
 * @param {[number]} start_at_letters [inputted string length at which autocomplete list should shown]
 * @param {[number]} count_results [number of max results]
 * @return {[Undefined]} Nothing returned, only make autocomplete visible or invisble
 */
 const searchButton = document.getElementById("searchButton")
 function set_autocomplete(id_formfield, id_autocomplete_div, result_list, start_at_letters=4, count_results=5) {
    let input = document.getElementById(id_formfield);
    let autocomplete_div = document.getElementById(id_autocomplete_div);
    input.onkeyup = function() {
        var characters = input.value;
        if (characters.length>=start_at_letters) {
            var res = autocomplete(result_list, characters);

            renderResults(res, characters, autocomplete_div, input, count_results);
            autocomplete_div.classList.remove('invisible');

        }
        else {

            autocomplete_div.classList.add("invisible");

            while (autocomplete_div.firstChild) {
                autocomplete_div.removeChild(autocomplete_div.firstChild);
            }
        }
    };
}


 function autocomplete(item_list, search_string) {
    let results = [];

    item_list.filter( function(item) {
        if (item.title.toLowerCase().includes(search_string.toLowerCase())) {
            results.push({'title': item.title, "slug": item.slug});

        };
    });
    return results
}

 function renderResults(results, search, container, form_id, max_results) {
    // delete unordered list from previous search result
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // get properties from input field
    let form_font = window.getComputedStyle(form_id, null).getPropertyValue('font-size');
    let form_width = form_id.offsetWidth;

    //set result list to same width less borders
    container.style.width = form_width.toString() + 'px';

    if (results.length>0) {

        // create ul and set classes
        let ul = document.createElement('UL');
        ul.classList.add('list-group', 'mt-1');

        // create list of results and append to ul
        if (results.length>max_results) {
            results = results.slice(0, max_results);
        }
        results.map(function(item) {
                let a = document.createElement('A');
                a.classList.add('autocomplete-result', 'list-group-item', 'p-1'); // autocomplete used for init click event, other classes are from bootstrap
                a.setAttribute("reference", form_id.id); // used for click-Event to fill the form
                a.style.fontSize = form_font;

                a.href = `/movie-locations/${item.slug}`;

                // see function below - marked search string in results
                a.innerHTML = colored_result(item.title, search);

                // add Eventlistener for search renderResults
                a.addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // get text from list item and set it into reffered form field
                    let content = a.innerText;
                    let form_id = a.getAttribute('reference');
                    document.getElementById(form_id).value = content;
                  searchButton.setAttribute('data-link', a.href);


                    // after choosen a result make div with results invisible -> after changing input content again,
                    // all of childs of current div will be deleted [line 48,49]
                    container.classList.add('invisible');

                });

                ul.append(a);
        });

        // append ul to container and make container visible
        container.append(ul);
        container.classList.remove('invisible');
        //choose_result(); // add Eventlistener to every result in ul
    }
    else {
        container.classList.add('invisible');

    }
}

// create span's with colored marked search strings
 function colored_result(string, search) {
    let splitted = string.toLowerCase().split(search.toLowerCase());

    let sp = []; // array of all spans, created in folling loop
    let start = 0; //start for slicing

    splitted.map(function(element, index) {
        // empty string at the beginning
        if (element == false) {
            sp.push("<span class='text-info'>" + string.slice(start, start + search.length) + "</span>");
            start = start + search.length;
        }
        else if (index +1 == splitted.length) {
            sp.push("<span>" + string.slice(start, start + element.length) + "</span>");
    }
        else {
            sp.push("<span>" + string.slice(start, start + element.length) + "</span>");
            start = start + element.length;
            sp.push("<span class='text-info'>" + string.slice(start , start + search.length) + "</span>");
            start = start  + search.length;
        }
        });
    return sp.join('')
}



export function autocompleteInit (data) {

    set_autocomplete('searchInput', 'form2_complete', data);


    const searchButton = document.getElementById("searchButton")
    const searchLink = searchButton.getAttribute("data-link")
let input = document.getElementById('searchInput')
input.addEventListener("blur", myBlurFunction, true);
input.addEventListener("click", handleInput, true)
input.addEventListener('change', function(event) {

       if (input.length <= 1 && searchLink.length > 1){
   // Checking for Backspace.
       searchButton.setAttribute("data-link", "")

       }

        });
     input.addEventListener('keydown', function(event) {

       if (searchLink.length > 1){
   // Checking for Backspace.
            if (event.keyCode == 8) {
               searchButton.setAttribute("data-link", "")
            }
            // Checking for Delete.
            if (event.keyCode == 46) {
              searchButton.setAttribute("data-link", "")

            }

       }

        });
searchButton.addEventListener('click', function(event) {
event.preventDefault()

event.target.disabled = true
if (input.value.length <= 1 &&  searchLink.length > 1){
    searchButton.setAttribute("data-link", "")

}
else if (input.value.length > 1 && searchLink == ""){

const inp = input.value.toLowerCase()

if(inp == "the" || inp =="the "){


}
else{


  let results = []
      data.filter( function(item) {
        if (item.title.toLowerCase().includes(input.value.toLowerCase())) {

            results.push({'title': item.title, "slug": item.slug});

        };
    });

    const newslug = results[0].slug
    if(newslug && results.length < 4  ){

      window.location.href = `/movie-locations/${newslug}`
    }
    else {

    }

}




}



else {


  let x = event.target.getAttribute("data-link")
  window.location.replace(x)
}

        });
function handleInput(){


if (input.value.length <= 1 && searchLink.length > 1 ) {
searchButton.setAttribute("data-link", "")

}

}
function myBlurFunction() {

  const classes= document.getElementById("form2_complete").classList.length
  setTimeout(() => {
 if (classes == 1){

   document.getElementById('form2_complete').classList.add("invisible")

 }
  }, 200);

}






 }


export default {autocompleteInit}
