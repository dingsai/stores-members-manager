<template>
	<div class="register">
		<el-form ref="registerForm" :rules="rules" :model="registerForm" label-width="80px" class="registerForm" label-position="right">
			<el-form-item label="商家名称" prop="storeName">
				<el-input v-model="registerForm.storeName" placeholder="请输入商家名称"></el-input>
			</el-form-item>
			<el-form-item label="商家地址" prop="selectedOptions">
				<el-cascader
					:options="options"
					v-model="registerForm.selectedOptions"
					@change="handleChange">
				</el-cascader>
			</el-form-item>
			<el-form-item label="详细地址" prop="detailsAddress">
				<el-input type="textarea" v-model="registerForm.detailsAddress" placeholder="请输入详细地址"></el-input>
			</el-form-item>
			<el-form-item label="商家分类" prop="storeClassify">
				<el-select class="business" v-model="registerForm.storeClassify" placeholder="商家分类">
					<el-option
					v-for="item in storeCategory"
					:key="item.id"
					:label="item.categoryName"
					:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上传图片">
				<upload
					className="RegisterUpload"
					ref="RegisterUpload"
					:accept="['png','jpg','jpeg']"
					:limit="1"
					:uploadUrl="uploadUrl"
					:requestParam="{}"
					:uploadList="fileList"
				>
				</upload>
			</el-form-item>
			<el-form-item label="手机号" prop="phoneNumber">
				<el-input v-model="registerForm.phoneNumber" placeholder="请输入手机号" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item label="账号" prop="account">
				<el-input v-model="registerForm.account" placeholder="请输入账号"></el-input>
			</el-form-item>
			<el-form-item label="设置密码" prop="passWord">
				<el-input v-model="registerForm.passWord" placeholder="请输入登录密码" type="password"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="repeatPassword">
				<el-input v-model="registerForm.repeatPassword" placeholder="请再次确认密码" type="password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="btn fl" @click="register">注册</el-button>
				<el-button type="primary" class="btn fl" @click="$router.go(-1)">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
import upload from '@/components/upload.vue';
import MD5 from 'js-md5';
import { regionData, CodeToText } from 'element-china-area-data'

import {
	phoneNumber,
	passWord,
	account
} from '@/assets/js/rules/common.js';
import {
	storeName,
	storeClassify,
	selectedOptions,
	detailsAddress
} from '@/assets/js/rules/container.js';
export default {
	components: {
		upload
	},
	data(){
		const checkPassword = (rule,value,callback)=>{
			if(value === ''){
				callback(new Error('请重复密码'))
			}
			if(value != this.registerForm.passWord){
				callback(new Error('两次密码输入不一致'))
			}else{
				callback()
			}
		}
		return {
			uploadUrl: INTERFACE.ossUpload,
			options: regionData,
			registerForm:{
				detailsAddress:'',
				selectedOptions:[]
			},
			province:'',
			city:'',
			area:'',
			businessType:'',
			fileList:[],
			rules:{
				phoneNumber,
				passWord,
				account,
				repeatPassword:[
					{required: true, message: '请重复密码',trigger: 'blur'},
					{validator: checkPassword, message: '两次密码输入不一致',trigger: 'blur'}
				],
				storeName,
				storeClassify,
				selectedOptions,
				detailsAddress
			},
			storeCategory:[]
		}
	},
	created(){
		this.$bus.$on('setFileList',(fileList)=>{
            this.fileList= fileList;
        });
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.merchantCategory();
		},
		merchantCategory(){
			this.$axios.get(INTERFACE.merchantCategory)
			.then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.storeCategory=res.data.data;
				}
			}).catch(error=>{
				console.log(error);
			})
		},
		handleChange () {
			var loc = "";
			for (let i = 0; i < this.registerForm.selectedOptions.length; i++) {
				loc += CodeToText[this.registerForm.selectedOptions[i]] + "-";
			}
			this.registerForm.province = loc.split("-")[0];
			this.registerForm.city = loc.split("-")[1];
			this.registerForm.county = loc.split("-")[2];
			if(this.registerForm.county){
				this.$refs['registerForm'].clearValidate(["selectedOptions"]);
			}
		},
		register(){
			this.$refs['registerForm'].validate(valid=>{
				if(valid){
					let obj={};
					Object.assign(obj, this.registerForm,{
						storeImages: this.fileList.length > 0 ? this.fileList[0].url : ''
					})
					delete obj.repeatPassword;
					if(!obj.storeImages){
						this.$message.warning("请上传图片");
						return false;
					}
					this.$axiosJson.post(INTERFACE.register,obj)
					.then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.$router.push({
								path:'/'
							})
						}
					}).catch(error=>{
						console.log(error);
					})
				}
			})
			
		},
	}
}
</script>
