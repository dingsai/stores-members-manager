<template>
	<div class="serviceManager">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>服务分类</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
					<el-form-item label="分类名称">
						<el-input v-model="searchForm.categoryName" placeholder="请输入分类名称"></el-input>
					</el-form-item>
					<el-button type="primary" @click="doSearch(1)">查询</el-button>
					<el-button type="primary" @click="Add">新增</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column type="index" label="序号">
					</el-table-column>
					<!-- <el-table-column prop="merchantName" label="商铺名称">
					</el-table-column> -->
					<el-table-column prop="categoryName" label="分类名称">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="120">
						<template slot-scope="scope">
							{{$store.getters.getPublicStatus(scope.row.status,'serviceEnableStatus')}}
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建日期">
					</el-table-column>
					<el-table-column prop="updateTime" label="更新日期">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="200">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button v-if="scope.row.status == 1" type="text" size="small" @click="handleAble(scope.row)">启用</el-button>
							<el-button v-if="scope.row.status == 0" type="text" size="small" @click="handleAble(scope.row)">禁用</el-button>
							<el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page" v-if="pageShow"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
			<el-form :model="form" label-width="100px">
				<el-form-item label="分类名称">
					<el-input v-model="form.categoryName" placeholder="请输入分类名称"></el-input>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-select v-model="form.status" placeholder="请选择">
						<el-option v-for="(item,index) in $store.state.container.enumList.serviceEnableStatus" :key="index" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Page from '@/components/page.vue'
import INTERFACE from '@/assets/js/interface.js'
import {STATUSCODE, Defined} from '@/assets/js/defined.js'
import {Loading} from 'element-ui';
export default {
	name:'serviceManager',
	components: {
		Page
	},
	data(){
		return {
			Defined,
			searchForm: {
				categoryName:''
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 10,
			form:{
				status:0
			},
			dialogFormVisible: false,
			title:'新增服务分类',
			pageShow:true,
		}
	},
	watch:{
        '$route.query':function(newVal,oldVal){
            this.getList();
        }
    },
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.pageShow = false;
			this.getList();
			this.$nextTick(()=>{
				this.pageShow=true;
			})
		},	
		doSearch(pageData){
            this.$router.push({
                path:'/serviceCategoryList',
                query:{
                    categoryName: this.searchForm.categoryName || '',
                    pageNumber: (pageData && pageData.pageCurrent) || 1,
                    pageSize: (pageData && pageData.pageSize) || this.$store.state.common.main.pageSize,
                }
            })
        },
        getList(){
            let queryParams=this.$route.query;
            this.pageSize=Number(queryParams.pageSize)
            this.updateParams(queryParams);
            Object.assign(queryParams,{
				categoryName: queryParams.categoryName || '',
                pageNumber:Number(queryParams.pageNumber) || 1,
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize,
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
            })
            this.$axios.get(INTERFACE.servicesCategoryList,{
                params:queryParams
            }).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.list= res.data.data.data || [];
                    this.total = res.data.data.total || 0;
					if(this.total > 0){
						this.currentPage= queryParams['pageNumber'];
						this.pageSize= queryParams['pageSize'];
						this.$nextTick(()=>{
							this.$refs.Page.pageCurrent = this.currentPage;
							this.$refs.Page.pageSize = this.pageSize;
						})
					}
                }
            }).catch(error=>{
                console.log(error);
            })
        },
		updateParams(params){
            Object.keys(this.searchForm).forEach((item,index)=>{
                this.searchForm[item]= params[item];
            })
        },
		handleEdit(row){
			this.dialogFormVisible=true;
			this.title="编辑服务分类";
			this.$axios.get(INTERFACE.servicesCategoryDetail,{
				params:{
					id: row.id
				}
			}).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.form = res.data.data;
                }
            }).catch(error=>{
                console.log(error);
            })
		},
		handleAble(row){
			this.$axios.get(INTERFACE.servicesCategoryChangeStatus,{
				params:{
					id: row.id,
					status: row.status == 0 ? 1: 0
				}
			}).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.$message.success(res.data.message);
					this.getList();
                }
            }).catch(error=>{
                console.log(error);
            })
		},
		handleDel(row){
			this.$confirm('请确认是否删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.get(INTERFACE.servicesCategoryDel,{
					params:{
						id: row.id
					}
				}).then(res=>{
					if(res.data.code == STATUSCODE.code01){
						this.$message.success('删除成功!');
						this.getList();
					}
				}).catch(error=>{
					console.log(error);
				})
			})
		},
		Add(){
			this.dialogFormVisible=true;
			this.form = this.$options.data.call(this).form;
			this.title="新增服务分类";
		},
		submitForm(){
			Object.assign(this.form,{
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
			})
			this.$axiosJson.post(INTERFACE.servicesCategoryAdd,this.form).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.$message.success(res.data.message);
					this.dialogFormVisible=false;
					this.getList();
                }
            }).catch(error=>{
                console.log(error);
            })
		}
	}
}
</script>
