<template>
	<div class="head">
		<div class="header_before">
			<el-row>
				<el-col :span="8">
					<img class="logo" src="@/assets/images/logo.jpg" alt="logo" width="140" height="42">
				</el-col>
				<el-col :span="16">
					<el-menu :default-active="activeIndex" class="el-menu-demo menu" mode="horizontal" @select="handleSelect">
						<el-menu-item index="1">注册</el-menu-item>
						<el-menu-item index="0">登录</el-menu-item>
					</el-menu>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>

export default {
	props:{
		title:{
			type: String,
      		default: null
		}
	},
	data(){
		return {
			activeIndex: '0',
		}
	},
	watch:{
		$route(newVal, oldVal){
			if(newVal.path == '/register'){
				this.activeIndex ='1'
			} else{
				this.activeIndex ='0'
			}
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			
		},
		handleSelect(key, keyPath) {
			if(key == 0){
				this.$router.push({
					path:'/login'
				})
			} else{
				this.$router.push({
					path:'/register'
				})
			}
		}
	}
}
</script>