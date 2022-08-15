<template>
	<div class="head">
		<div class="header_after">
			<el-row>
				<el-col :span="6">
					<img class="logo" src="@/assets/images/logo.jpg" alt="logo" width="140" height="42" @click="loginOut">
					<span class="merchantName">{{userInfo.merchantName}}</span>
				</el-col>
				<el-col :span="10">
					<!-- <el-menu :default-active="activeIndex" class="el-menu-demo menu" mode="horizontal">
						<el-menu-item v-for="(item,index) in menuList" :index="index.toString()" :key="index" @click="tabsClick(item,index)">{{item.sourceName}}</el-menu-item>
					</el-menu> -->
				</el-col>
				<el-col :span="8" class="userInfoCol">
					<svg @click="loginOut" t="1659667532955" class="icon ml10 cursor loginOut" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1810" width="22" height="22"><path d="M512.282433 957.937398c-247.529583 0-448.190719-200.661136-448.190719-448.185602 0-191.062524 119.757524-353.747743 288.115953-418.226267l0 69.339228c-132.148739 60.736293-224.088708 193.907315-224.088708 348.887039 0 212.150818 172.011632 384.16245 384.163473 384.16245 212.152864 0 384.158357-172.010609 384.158357-384.16245 0-154.979724-91.944062-288.150746-224.093824-348.917738l0-69.308529c168.359452 64.478524 288.115953 227.16886 288.115953 418.226267C960.468035 757.276263 759.807922 957.937398 512.282433 957.937398L512.282433 957.937398 512.282433 957.937398zM480.268298 61.561078l64.022129 0 0 449.339892-64.022129 0L480.268298 61.561078 480.268298 61.561078 480.268298 61.561078zM480.268298 61.561078" p-id="1811" fill="#d81e06"></path></svg>
					<!-- <el-tooltip class="item" effect="light" :content="userInfo.account" placement="bottom-end">
						<span class="userName">{{userInfo.account}}</span>
					</el-tooltip>
					<img v-if="userInfo.headImg" src="@/assets/images/avatar.png" alt="" width="30" height="30">
					<svg v-else t="1631255342198" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16802" width="30" height="30"><path d="M1017.9653723 512.86274275c0 279.0628955-226.47983787 505.32966741-505.87339321 505.32966742-279.36794055 0-505.76744221-226.26793586-505.7674422-505.32966742 0-214.20351033 133.32691968-397.2074075 321.62137202-470.75243235 56.89211335-22.95058432 119.04684032-35.62509995 184.15887701-35.62509995 65.19237291 0 127.2935424 12.6617088 184.23921323 35.62509995C884.62680974 115.65533525 1017.9653723 298.66039637 1017.9653723 512.86274275L1017.9653723 512.86274275M317.68381326 406.29132402c0 85.15886877 43.63312128 158.88901689 107.06158706 194.9786715 26.30491819 14.96817664 55.92341959 23.60026112 87.34657877 23.60026112 30.32057173 0 58.90634411-8.07438563 84.5219988-22.02264121 64.92691342-35.40039111 109.96650325-110.03170361 109.96650325-196.5423195 0-120.45330887-87.22665699-218.49859527-194.4873381-218.49859527C404.89766229 187.79389269 317.68381326 285.84034304 317.68381326 406.29132402L317.68381326 406.29132402M514.1469605 985.44544768c147.77814926 0 279.60545735-67.96223033 366.0101211-174.32058425-10.20737422-83.89910187-91.96068067-155.32161707-207.66483001-190.94788096-43.69948672 39.3112576-99.53092722 62.96507619-160.41424327 62.9650762-62.23506318 0-119.20518485-24.92639232-163.3296384-65.94800072-112.55123854 32.12406443-194.99147833 97.64826226-214.32110421 176.16366251C220.16828075 909.83263346 358.36078877 985.44544768 514.1469605 985.44544768L514.1469605 985.44544768M514.1469605 985.44544768L514.1469605 985.44544768z" p-id="16803" fill="#bfbfbf"></path></svg> -->
					<el-dropdown class="fr">
						<div class="el-dropdown-link">
							<span class="userName cursor">{{userInfo.account}}</span>
						</div>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native='updateMerchant'>修改店铺信息</el-dropdown-item>
							<el-dropdown-item @click.native='updatePassword'>修改密码</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<img class='fr' v-if="userInfo.headImg" src="@/assets/images/avatar.png" alt="" width="30" height="30">
					<svg v-else t="1631255342198" class="icon fr" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16802" width="30" height="30"><path d="M1017.9653723 512.86274275c0 279.0628955-226.47983787 505.32966741-505.87339321 505.32966742-279.36794055 0-505.76744221-226.26793586-505.7674422-505.32966742 0-214.20351033 133.32691968-397.2074075 321.62137202-470.75243235 56.89211335-22.95058432 119.04684032-35.62509995 184.15887701-35.62509995 65.19237291 0 127.2935424 12.6617088 184.23921323 35.62509995C884.62680974 115.65533525 1017.9653723 298.66039637 1017.9653723 512.86274275L1017.9653723 512.86274275M317.68381326 406.29132402c0 85.15886877 43.63312128 158.88901689 107.06158706 194.9786715 26.30491819 14.96817664 55.92341959 23.60026112 87.34657877 23.60026112 30.32057173 0 58.90634411-8.07438563 84.5219988-22.02264121 64.92691342-35.40039111 109.96650325-110.03170361 109.96650325-196.5423195 0-120.45330887-87.22665699-218.49859527-194.4873381-218.49859527C404.89766229 187.79389269 317.68381326 285.84034304 317.68381326 406.29132402L317.68381326 406.29132402M514.1469605 985.44544768c147.77814926 0 279.60545735-67.96223033 366.0101211-174.32058425-10.20737422-83.89910187-91.96068067-155.32161707-207.66483001-190.94788096-43.69948672 39.3112576-99.53092722 62.96507619-160.41424327 62.9650762-62.23506318 0-119.20518485-24.92639232-163.3296384-65.94800072-112.55123854 32.12406443-194.99147833 97.64826226-214.32110421 176.16366251C220.16828075 909.83263346 358.36078877 985.44544768 514.1469605 985.44544768L514.1469605 985.44544768M514.1469605 985.44544768L514.1469605 985.44544768z" p-id="16803" fill="#bfbfbf"></path></svg>
					
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
export default {
	data(){
		return {
			activeIndex: '0',
			companyInfo: {},
			userInfo: {},
			menuList: [],
			
		}
	},
	watch:{
		$route(to,from,next){
			//监听地理栏地址(路由)变化-匹配当前激活的菜单和页面展示
			this.getActiveTab();
		}
	},
	mounted(){
		this.init();
		this.userInfo= sessionStorage.getItem('userInfo')? JSON.parse(sessionStorage.getItem('userInfo')) : {}
	},
	methods:{
		init(){
			this.menuList=this.$store.state.common.main.menuList;
			//刷新页面-匹配当前激活的菜单和页面展示
			this.getActiveTab();
		},
		loginOut(){
			this.$axios.get(INTERFACE.logout)
			.then(res =>{
				if(res.data.code == STATUSCODE.code01){
					this.$router.push({
						path:'/'
					})
					this.$message.success(res.data.message);
					this.$store.commit("setToken",'');
					sessionStorage.setItem("token","");

				}
			}).catch(err=>{
				console.log(err)
			})
			
		},
		getActiveTab(){
			let list={};
			this.menuList.map((item,index)=>{
				//匹配一级 展示对应的左侧菜单
				if(this.$route.path.indexOf(item.sourceUrl) > -1){
					this.activeIndex=index.toString();
					Object.assign(list,{
						data: item.children,
						index:this.activeIndex
					})
				}
				// //匹配二级
				item.children.map((item1,index1)=>{
					if(this.$route.path.indexOf(item1.sourceUrl) > -1){
						this.activeIndex=index.toString();
						Object.assign(list,{
							data: item.children,
							index:this.activeIndex +'-'+ index1
						})
					}
				})
				this.$bus.$emit('setMenuList',list);
			})
		},
		updateMerchant(){
			this.$router.push({
				path:'/updateMerchantInfo',
				query:{
					merchantId:this.userInfo.merchantId,
					account: this.userInfo.account
				}
			})
		},
		updatePassword(){
			this.$router.push({
				path:'/forget',
				query:{
					merchantId:this.userInfo.merchantId,
					account: this.userInfo.account,
					phoneNumber: this.userInfo.phoneNumber
				}
			})
		}
	}
}
</script>
