import { Tooltip, Popover, Collapse, Toast } from "bootstrap/dist/js/bootstrap.esm.min.js";

export const initBootstrap = function (config) {
  // Enabling tooltips
  if (config.tooltip) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))

    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl)
    })
  }

  // Enabling popovers
  if (config.popover) {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))

    popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl, {})
    })
  }
  if ( config.collapse )  {
var collapseTriggerList = [].slice.call(document.querySelectorAll('.collapse'))
var collapseList = collapseTriggerList.map(function (collapseEl) {
  const collapse = new Collapse( collapseEl , {
  toggle: false
})



  let movieCollapse = document.getElementById("movieLocationCollapsible")
collapseEl.addEventListener('shown.bs.collapse', function (e) {
  e.preventDefault()
  
})
})
  let anchorTag = document.querySelector( "#myCollapsibleBtn" )
  anchorTag.addEventListener( "click", function ( e ) {
e.preventDefault()
 
    if ( document.getElementById( "mainPlotContent" ) && document.getElementById( "metaPlotContent" ))
    {
    
      let mainPlot = document.getElementById( "mainPlotContent" )
      let mainText = mainPlot.innerText
      const lastThree = mainText[mainText.length - 1] + mainText[mainText.length - 2] + mainText[mainText.length - 3]
      console.log("🚀 ~ file: bootstrap.js ~ line 39 ~ lastThree", lastThree)
       let metaPlot = document.getElementById( "metaPlotContent" )
  
      
      if ( lastThree == "..." )
      {
        
       
        let newPlot = mainText.lastIndexOf( "..." );
        let result = mainText.substring(0, newPlot)
        let newContent = result.concat( metaPlot.innerText )
        metaPlot.classList.add( "d-none" )
        let div = document.createElement( "div" )
        div.setAttribute( "class", "mainPlotContent" )
        div.innerHTML = mainText
        metaPlot.appendChild( div )
        mainPlot.innerHTML = newContent
      //collapse.toggle()
        

       }
      else
      {
        if ( metaPlot.classList.contains( "d-none" ) )
        {
          let firstContent = document.querySelector(".mainPlotContent")
          mainPlot.innerHTML = firstContent.innerText
          firstContent.remove()

          metaPlot.classList.remove( "d-none" )
        //   collapse.toggle()
      
         }
    
      // collapse.toggle()
      }

    }

  } )

  }



  // Enabling toasts
  if (config.toasts) {
    const toastTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="toast"]'))

    toastTriggerList.map(function (toastTriggerEl) {
      // Define the target property
      let toastTarget = null

      if ("A" === toastTriggerEl.nodeName) {
        toastTarget = toastTriggerEl.href || null

        if (toastTarget.includes('#')) {
          toastTarget = `#${toastTarget.split("#").pop()}`
        } else {
          return
        }
      } else if ("BUTTON" === toastTriggerEl.nodeName) {
        toastTarget = toastTriggerEl.dataset.bsTarget || null
      }

      // Check if the target exists
      const toastTargetEl = document.querySelector(toastTarget);

      if (!toastTargetEl) {
        return
      }

      // Init toast
      const toast = new Toast(toastTargetEl)

      // Add click even to trigger
      toastTriggerEl.addEventListener("click", function (event) {
        event.preventDefault();
        toast.show()
      })
    })
  }
}
