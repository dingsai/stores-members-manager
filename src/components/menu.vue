<template>
	<div class="sidebar-container">
		<div class="menuBar">
			<el-menu :default-active="menuActiveIndex" class="el-menu-vertical-demo" :unique-opened="true" text-color="#fff">
				<div v-for="(item,index) in menuList" :key="item.id" >
					<el-menu-item v-if="item.children.length == 0" :index="index.toString()" @click="menuClick(item)">
						<i class="el-icon-document"></i>
						<span slot="title">{{item.sourceName}}</span>
					</el-menu-item>
					<el-submenu v-else-if="item.children && item.children.length > 0" :index="index.toString()">
						<template slot="title">
                            <i class="icon" v-html="item.icon"></i>
                            <span>{{item.sourceName}}</span>
						</template>
						<el-menu-item v-for="(item1,index1) in item.children" :index="index.toString()+'-'+index1.toString()" :key="item1.id"  @click="menuClick(item1)">{{item1.sourceName}}</el-menu-item>
					</el-submenu>
                </div>
			</el-menu>
		</div>
	</div>
</template>
<script>
export default {
    props:{
		menuList:{
			type: Array,
            default: null
		},
        menuActiveIndex:{
            type: String,
            default: null
        }
	},
    data(){
        return {
        }
    },
    methods:{
        init(){
        },
        menuClick(data){
            this.$router.push({
                path: data.sourceUrl
            })
        }
    }
}
</script>
<style lang="less">

.sidebar-container {
    width: 170px;
    transition: width 0.28s;
    overflow-y: auto;
    background:rgb(31, 47, 88);

}
    .menuBar,.el-menu--vertical{
        width:170px;
        overflow: hidden;
        .el-menu{
            border:none;
            background:rgb(31, 47, 88);
            .el-menu-item{
                min-width:170px;
                background:rgb(31, 47, 88);
                color:#bfcbd9!important;
            }
            .el-menu-item:hover{
                background:rgb(0, 37, 74)!important;
                color:rgb(138, 197, 236)!important;
            }
            .el-menu-item.is-active{
                background:rgb(0, 37, 74)!important;
                color:rgb(138, 197, 236)!important;
            }
            .el-submenu.is-active{
                background:rgb(35, 72, 104);
                color:rgb(138, 197, 236)!important;
                .el-submenu__title{
                    background:rgb(0, 37, 74)!important;
                    color:rgb(138, 197, 236)!important;
                    i {
                        color: rgb(138, 197, 236);
                    }
                }
            }
            .el-submenu__title{
                text-align: left;
                padding-left:10px!important;
                background:rgb(31, 47, 88);
                color:rgb(191, 203, 217)!important;
                i{
                    color:#bfcbd9;
                    float:left;
                } 
                span{
                    margin-left:14px;
                }
            }
            //设置鼠标悬停时el-submenu的样式
            .el-submenu__title:hover{
                background:rgb(0, 37, 74)!important;
                color:rgb(138, 197, 236)!important;
                i {
                    color: rgb(138, 197, 236);
                }
            }

            .el-submenu .el-menu-item{
                background:rgb(31, 47, 88);
                padding:0px!important;
            }
        }
    }
</style>