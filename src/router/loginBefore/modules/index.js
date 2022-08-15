export default{
  login:()=>import(/* webpackChunkName:"loginBefore" */ "@/views/loginBefore/login.vue"),
  register:()=>import(/* webpackChunkName:"loginBefore" */ "@/views/loginBefore/register.vue"),
  forget:()=>import(/* webpackChunkName:"loginBefore" */ "@/views/loginBefore/forget.vue"),
}