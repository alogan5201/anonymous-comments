console.log('This file was lazyLoaded.')

export default function () {
  console.log('foo.')
}

setTimeout(() => {
  import( /* webpackChunkName: "login.lazy" */ './login/login').then(module => {
    const login = module.default

    login()
  })
}, 2000)
