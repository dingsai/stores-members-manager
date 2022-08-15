<template>
<div id="app">
    <!-- 登录前的 -->
	<div v-if="!token" class="box">
		<HeaderLoginBefore :title="$route.meta.title || null"></HeaderLoginBefore>
		<div class="pt56">
			<router-view />
		</div>
	</div>
	<!-- 登录后 -->
	<div v-else class="main">
		<HeaderLoginAfter></HeaderLoginAfter>
		<div class="pt56">
			<Menu v-if="menuList && menuList.length > 0" class="fl" :style="{height:containerHeight}" :menuList="menuList" :menuActiveIndex="menuActiveIndex"></Menu>
			<div class="container" :style="{height:containerHeight,width:containerWidth}">
				<div class="contain">
					<router-view />
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import HeaderLoginBefore from '@/components/header_login_before.vue';
import HeaderLoginAfter from '@/components/header_login_after.vue';
import Menu from '@/components/menu.vue';
export default {
  name: 'App',
  components:{
		HeaderLoginBefore,
		HeaderLoginAfter,
		Menu
	},
	data(){
		return {
			containerHeight: '',
			containerWidth:'',
			token:'',
			menuList: [],
			menuActiveIndex:'',
		}
	},
	watch:{
		$route(to,from,next){
			this.token=this.$store.state.common.main.token || sessionStorage.getItem("token");
			this.containerHeight=window.innerHeight - 56 + 'px';
			this.containerWidth=window.innerWidth - 170 + 'px';
		}
	},
	created(){
		this.$bus.$on('setMenuList',(data)=>{
			this.menuActiveIndex= data.index; //menu Highlight index
        });
    },
	mounted(){
		this.init();
		//控制台打开时拖拽页面宽高 页面宽高自适应
		window.addEventListener('resize', this.computedHeight)
	},  
	methods:{
		init(){
			this.token=this.$store.state.common.main.token || sessionStorage.getItem("token");
			this.containerHeight=window.innerHeight - 56 + 'px';
			this.menuList = this.$store.state.common.main.menuList
		},
		computedHeight(){
			this.containerHeight=window.innerHeight - 56 + 'px';
		}
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
