<template>
	<div class="register">
		<el-form ref="forgetForm" :rules="rules" :model="forgetForm" label-width="80px" class="forgetForm" label-position="right">
			<el-form-item label="手机号" prop="phoneNumber">
				<el-input :disabled="this.token!=''" class="mobilePhone" v-model="forgetForm.phoneNumber" placeholder="请输入手机号" maxlength="11">
                </el-input>
			</el-form-item>
			<el-form-item label="账号" prop="account">
				<el-input :disabled="this.token!=''" class="mobilePhone" v-model="forgetForm.account" placeholder="请输入账号"></el-input>
			</el-form-item>
			<el-form-item label="设置密码" prop="passWord">
				<el-input v-model="forgetForm.passWord" placeholder="请输入登录密码" type="password"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="repeatPassword">
				<el-input v-model="forgetForm.repeatPassword" placeholder="请再次确认密码" type="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="btn fl" @click="submit">确认</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
import {
	phoneNumber,
	account,
	passWord,
} from '@/assets/js/rules/common.js';
export default {
	components: {
	},
	data(){
		const checkPassword = (rule,value,callback)=>{
			if(value === ''){
				callback(new Error('请重复密码'))
			}
			if(value != this.forgetForm.passWord){
				callback(new Error('两次密码输入不一致'))
			}else{
				callback()
			}
		}
		return {
			forgetForm:{},
			rules:{
				phoneNumber,
				passWord,
				account,
				repeatPassword:[
					{required: true, message: '请重复密码',trigger: 'blur'},
					{validator: checkPassword, message: '两次密码输入不一致',trigger: 'blur'}
				]
			},
			token:''
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			//修改密码
			this.token=sessionStorage.getItem('token');
			if(this.token){
				Object.assign(this.forgetForm,{
					phoneNumber:this.$route.query.phoneNumber,
					account:this.$route.query.account
				})
			}
		},
		submit(){
			this.$refs['forgetForm'].validate(valid=>{
				if(valid){
					let obj={};
					Object.assign(obj,this.forgetForm)
					delete obj.repeatPassword;
					this.$axiosJson.post(INTERFACE.updatePassWord,obj)
					.then(res=>{
						if(res.data.code== STATUSCODE.code01){
							this.$message.success('已修改密码，请重新登录');
							this.$router.push({
								path:'/'
							})
							this.$store.commit("setToken",'');
							sessionStorage.setItem("token","");
						}
					}).catch(error=>{
						console.log(error);
					})
				}
			})
		}
	}
}
</script>
