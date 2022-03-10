

export default function() {

}

setTimeout(() => {
  import(/* webpackChunkName: "bar.testtwo" */ './foo/bar/bar').then(module => {
    const bar = module.default

    bar()

    alert('this is a test')
  })
}, 2000)
