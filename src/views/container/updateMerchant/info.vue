<template>
	<div class="updateMerchant">
		<el-form ref="updateMerchantForm" :rules="rules" :model="updateMerchantForm" label-width="80px" class="updateMerchantForm" label-position="right">
            <el-form-item label="账号" prop="account">
				<el-input disabled v-model="updateMerchantForm.account" placeholder="请输入账号"></el-input>
			</el-form-item>
            <el-form-item label="手机号" prop="oldPhone">
				<el-input v-model="updateMerchantForm.oldPhone" placeholder="请输入手机号" maxlength="11"></el-input>
			</el-form-item>
			<el-form-item label="商家名称" prop="storeName">
				<el-input v-model="updateMerchantForm.storeName" placeholder="请输入商家名称" ></el-input>
			</el-form-item>
			<el-form-item label="商家地址" prop="selectedOptions">
				<el-cascader
					:options="options"
					v-model="updateMerchantForm.selectedOptions"
					@change="handleChange">
				</el-cascader>
			</el-form-item>
			<el-form-item label="详细地址" prop="detailsAddress">
				<el-input type="textarea" v-model="updateMerchantForm.detailsAddress" placeholder="请输入详细地址"></el-input>
			</el-form-item>
			<el-form-item label="商家分类" prop="storeClassify">
				<el-select class="business" v-model="updateMerchantForm.storeClassify" placeholder="商家分类">
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
					className="updateMerchantUpload"
					ref="updateMerchantUpload"
					:accept="['png','jpg','jpeg']"
					:limit="1"
					:uploadUrl="uploadUrl"
					:requestParam="{}"
                    :uploadList="fileList"
				>
				</upload>
			</el-form-item>
			<el-form-item label="新手机号" prop="phoneNumber">
				<el-input v-model="updateMerchantForm.newPhoneNumber" placeholder="请输入新手机号" maxlength="11"></el-input>
			</el-form-item>
			<!-- <el-form-item label="设置密码" prop="passWord">
				<el-input v-model="updateMerchantForm.passWord" placeholder="请输入登录密码" type="password"></el-input>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" class="btn fl" @click="updateMerchant">确认</el-button>
				<el-button type="primary" class="btn fl" @click="$router.go(-1)">返回</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
import upload from '@/components/upload.vue';
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

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
			if(value != this.updateMerchantForm.passWord){
				callback(new Error('两次密码输入不一致'))
			}else{
				callback()
			}
		}
		return {
			uploadUrl: INTERFACE.ossUpload,
			options: regionData,
			updateMerchantForm:{
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
            this.merchantMessageQuery();
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
        merchantMessageQuery(){
            this.$axios.get(INTERFACE.merchantMessageQuery,{
                params:{
                    merchantId:this.$route.query.merchantId
                }
            })
			.then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.updateMerchantForm=res.data.data;
                    Object.assign(this.updateMerchantForm,{
                        account: this.$route.query.account,
                        oldPhone: res.data.data.phoneNumber
                    })
                    this.fileList = [];
					if(this.updateMerchantForm && this.updateMerchantForm.storeImages){
						this.fileList.push({
							url: this.updateMerchantForm.storeImages,
							uid: new Date().getTime()
						})
					}
                    this.updateMerchantForm.selectedOptions = TextToCode[this.updateMerchantForm.province][this.updateMerchantForm.city][this.updateMerchantForm.county].code;
				}
			}).catch(error=>{
				console.log(error);
			})
        },
		handleChange () {
			var loc = "";
			for (let i = 0; i < this.updateMerchantForm.selectedOptions.length; i++) {
				loc += CodeToText[this.updateMerchantForm.selectedOptions[i]] + "-";
			}
			this.updateMerchantForm.province = loc.split("-")[0];
			this.updateMerchantForm.city = loc.split("-")[1];
			this.updateMerchantForm.county = loc.split("-")[2];
			if(this.updateMerchantForm.county){
				this.$refs['updateMerchantForm'].clearValidate(["selectedOptions"]);
			}
            console.log(loc)

		},
		updateMerchant(){
			this.$refs['updateMerchantForm'].validate(valid=>{
				if(valid){
					let obj={};
					Object.assign(obj, this.updateMerchantForm,{
						storeImages: this.fileList.length > 0 ? this.fileList[0].url : '',
                        phoneNumber: this.updateMerchantForm.newPhoneNumber
					})
					delete obj.repeatPassword;
					if(!obj.storeImages){
						this.$message.warning("请上传图片");
						return false;
					}
					this.$axiosJson.post(INTERFACE.merchantMessageUpdate,obj)
					.then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
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
