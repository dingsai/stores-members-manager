import Vue from 'vue';
import router from '@/router'
import axios from 'axios';  
import Qs from 'qs';  
import {Loading,Message} from 'element-ui';
import store from '@/store/index.js'
import {Defined} from '@/assets/js/defined.js'
let loadingInstance,
    loadingStatus = 0; //避免重复点击提交
let responseArr = [function (data) {
    loadingStatus =1;
    if(loadingStatus == 0){
        //结束加载
        loadingInstance.close();
    }
    let jsonData= JSON.parse(data)
    let thisStatus= jsonData.code;
    if(thisStatus && thisStatus!='200'){
        Message.error(jsonData.message);
        if(thisStatus == '-100' || thisStatus == '401'){
            router.push({
                path:"/"
            })
            store.commit("token","");
            sessionStorage.clear();
        }
    }
    return jsonData;
}]

//请求拦截器操作
let interceptorRequest= (config)=>{
    //开启加载
    loadingInstance = Loading.service({
        lock:true,
        text:'loading',
        spinner:'el-icon-loading',
        background:'rgba(0,0,0,0.7)'
    })
    loadingStatus+=1;
    //请求头添加token
    const token = Defined.GetQueryString('token')?decodeURIComponent(Defined.GetQueryString('token')) : (store.state.common.main.token || sessionStorage.getItem('token') ||'');
    if(token){
        config.headers['token']=token;
        config.headers['Authorization']=token;
    }
    return config;
}
//响应拦截器操作
let interceptorReponse= (response)=>{
    if(response.headers['token']){
        store.commit('setToken', response.headers['token']);
    }
    setTimeout(()=>{
        loadingInstance.close();
    },1000);
    return response;
}

let errorRes= (error)=>{
    return Promise.reject(error);
}

//axios实例
let axiosForm = axios.create({
    baseURL:'/',
    headers:{
        'Content-type':'application/x-www-form-urlencoded',//application/json;charset=UTF-8
    },
    transformRequest:[function(data){
        return Qs.stringify(data);
    }],
    transformResponse:responseArr
})
let axiosJson = axios.create({
    baseURL:'/',
    headers:{
        'Content-type':'application/json;charset=UTF-8',
    },
    transformResponse:responseArr
})
let axiosFormData = axios.create({
    baseURL:'/',
    headers:{
        'Content-type':'multipart/form-data',
    },
    transformResponse:responseArr
})

//请求拦截器
axiosForm.interceptors.request.use(interceptorRequest,errorRes)
axiosJson.interceptors.request.use(interceptorRequest,errorRes)
axiosFormData.interceptors.request.use(interceptorRequest,errorRes)

//响应拦截器
axiosForm.interceptors.response.use(interceptorReponse,errorRes)
axiosJson.interceptors.response.use(interceptorReponse,errorRes)
axiosFormData.interceptors.response.use(interceptorReponse,errorRes)


Vue.prototype.axios=axios;
Vue.prototype.$axios=axiosForm;
Vue.prototype.axiosJson=axiosJson;
Vue.prototype.axiosFormData=axiosFormData;

export default axiosJson;