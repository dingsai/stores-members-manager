import loginBefore from "../modules/index.js";
export default [
  {path:"/", name:"/", component: loginBefore.login},
  {path:"/login", name:"login", component:loginBefore.login},
  {path:"/register", name:"register", component:loginBefore.register},
  {path:"/forget", name:"forget", component:loginBefore.forget},
]