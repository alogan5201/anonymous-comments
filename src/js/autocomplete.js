
  // Example 2


window.addEventListener('DOMContentLoaded', (event) => {


  import(/* webpackChunkName: "lazy-module.autocomplete" */ './utils/autocomplete').then(module => {
            const foo = module.default

            foo()
        })


});


