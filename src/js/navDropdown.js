import {  Dropdown} from 'bootstrap/dist/js/bootstrap.esm.min.js'
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
      return new Dropdown(dropdownToggleEl)
    })

export default dropdownlist
