import Vue from 'vue'
import VueRouter from 'vue-router'
import loginBefore from './loginBefore/routers/index.js';
import container from './container/routers/index.js';
let common = {
  path:"*",
  redirect:"404.htm"
}
Vue.use(VueRouter)
const router = new VueRouter({
  mode: typeof (history.pushState) === 'function' ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes:[].concat(loginBefore,container,common)
})

export default router

//点击同一个路由操作 vue会抛出错误，此方法修改路由跳转的方法
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
