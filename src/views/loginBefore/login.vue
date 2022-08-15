<template>
	<div class="bg" :style="{height:containerHeight}">
		<div class="login ps">
			<el-form ref="form" :model="loginForm" label-width="80px" class="loginForm" label-position="right">
				<el-tabs v-model="activeName" class="loginTabs">
					<el-tab-pane label="登录" name="0">
						<el-form-item label="账号">
							<el-input class="mobilePhone" v-model="loginForm.account" placeholder="请输入账号"></el-input>
						</el-form-item>
						<el-form-item label="密码">
							<el-input v-model="loginForm.passWord" placeholder="请输入登录密码" type="password"></el-input>
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
				<el-button type="primary" class="w100" @click="login">登录</el-button>
				<div class="forgetPassword el-row">
					<span class="fl ft16">
						<a class="textCenter" href="/forget">忘记密码</a>
					</span>
					<span class="fl ft16">
						<a class="textCenter" href="/register">立即注册</a>
					</span>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
import MD5 from 'js-md5';
export default {
	components: {
		
	},
	data(){
		return {
			loginForm: {},
			activeName: '0',
			containerHeight: 0,
		}
	},
	created() {
		document.onkeydown =(e) => {
			e = window.event || e;
			if((this.$route.path=='/login' || this.$route.path=='/' ) && (e.code=='Enter'||e.code=='enter')){
				//调用登录事件方法
				this.login();
			}
		}
	},
	mounted(){
		this.init();
		window.addEventListener('resize', this.getContainerHeight)
	},
	methods:{
		init(){
			this.containerHeight=window.innerHeight - 56 + 'px';
		},
		getContainerHeight(){
			this.containerHeight=window.innerHeight - 56 + 'px';
		},
		login(){
			if(!this.loginForm.account || !this.loginForm.passWord){
				this.$message.warning("请检查账号和密码");
				return false;
			}
			let obj={};
			Object.assign(obj,this.loginForm)
			this.$axiosJson.post(INTERFACE.login,obj)
			.then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.$router.push({
						path:'/serviceCategoryList'
					})
					this.$store.commit("setToken",res.data.data.token);
					sessionStorage.setItem('token',res.data.data.token);
					sessionStorage.setItem('userInfo',JSON.stringify(res.data.data));
				}
			}).catch(error=>{
				console.log(error);
			})
		}
	}
}
</script>
