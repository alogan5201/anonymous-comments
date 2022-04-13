

export default function () {
  
}

setTimeout(() => {
  import( /* webpackChunkName: "login.lazy" */ './login/login').then(module => {
    const login = module.default

    login()
  })
}, 2000)
