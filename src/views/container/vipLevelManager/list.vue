<template>
	<div class="vipLevelManagerList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>商家会员级别</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
				<el-form-item label="会员级别名称">
					<el-input v-model="searchForm.memberName" placeholder="请输入会员级别名称"></el-input>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
				<el-button type="primary" @click="add">新增会员</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else  class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column prop="memberName" label="会员级别">
					</el-table-column>
                    <el-table-column prop="memberDiscount" label="会员折扣">
					</el-table-column>
					<el-table-column prop="createTime" label="创建日期">
					</el-table-column>
                    <el-table-column prop="updateTime" label="更新日期">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="120">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row> -->
			</div>
		</el-row>
		<el-dialog title="会员级别配置" :visible.sync="dialogFormVisible" width="40%">
			<el-form :rules="rules" :model="vipForm" ref="vipForm" label-width="100px">
				<el-form-item label="会员级别" prop="memberName">
					<el-input v-model="vipForm.memberName" placeholder="请输入会员级别,例如：一级会员"></el-input>
				</el-form-item>
                <el-form-item label="会员折扣" prop="memberDiscount">
					<el-input v-model="vipForm.memberDiscount" placeholder="九折请输入0.9，没有折扣请输入1"></el-input>
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
import upload from '@/components/upload.vue';
import {
	memberName,
	memberDiscount
} from '@/assets/js/rules/container.js';
export default {
	name:'vipLevelManagerList',
	components: {
		Page,
		upload
	},
	data(){
		return {
			Defined,
			searchForm: {},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 0,
			vipForm:{
				memberName:'',
				memberDiscount:''
			},
			currentRow: null,
			dialogFormVisible: false,
			rules:{
				memberName,
				memberDiscount
			},
			status:'add',
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
			this.getList();
		},	
		doSearch(pageData){
            this.$router.push({
                path:'vipLevelManagerList',
                query:{
                    memberName: this.searchForm.memberName || '',
                    // pageNumber: (pageData && pageData.pageCurrent) || 1,
                    // pageSize: (pageData && pageData.pageSize) || this.$store.state.common.main.pageSize,
                }
            })
        },
        getList(){
            let queryParams=this.$route.query;
            this.pageSize=Number(queryParams.pageSize)
            this.updateParams(queryParams);
            Object.assign(queryParams,{
				memberName:queryParams.memberName || '',
                // pageNumber:Number(queryParams.pageNumber) || 1,
                // pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize,
            	merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
			})
            this.$axiosJson.post(INTERFACE.merchantVipLevelList,queryParams).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.list= res.data.data || [];
                    // this.total = res.data.total || 0;
					// if(this.total > 0){
					// 	this.currentPage= queryParams['pageNumber'];
					// 	this.pageSize= queryParams['pageSize'];
					// 	this.$nextTick(()=>{
					// 		this.$refs.Page.pageCurrent = this.currentPage;
					// 		this.$refs.Page.pageSize = this.pageSize;
					// 	})
					// }
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
        add(){
            this.dialogFormVisible=true;
			this.status = 'add';
			this.$nextTick(()=>{
				this.$refs['vipForm'].resetFields();
				this.vipForm = this.$options.data.call(this).vipForm;
			})
        },
        handleEdit(row){
            this.dialogFormVisible=true;
			this.status= 'edit';
			this.$nextTick(()=>{
				this.$refs['vipForm'].resetFields();
				this.currentRow = row;
			})
			this.$axios.get(INTERFACE.merchantVipLevelDetail,{
				params:{id: row.id}
			}).then(res => {
				if(res.data.code == STATUSCODE.code01){
					this.vipForm = res.data.data;
				}
			}).catch(err=>{
				console.log(err);
			})
        },
        handleDel(row){
            this.$confirm('请确认是否删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.get(INTERFACE.merchantVipLevelDelete,{
					params:{
						id: row.id
					}
				}).then(res => {
					if(res.data.code == STATUSCODE.code01){
						this.$message.success('删除成功!');
						this.getList();
					}
				}).catch(err=>{
					console.log(err);
				})
			})
        },
		submitForm(){
			this.$refs['vipForm'].validate(valid=>{
				if(valid){
					let obj = {}
					Object.assign(obj,{
						id: this.vipForm.id,
  						memberName: this.vipForm.memberName,
						memberDiscount: Number(this.vipForm.memberDiscount),
						merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
					})
		
					let url = this.status == 'add'? INTERFACE.merchantVipLevelAdd:INTERFACE.merchantVipLevelUpdate;
					this.$axiosJson.post(url,obj).then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.getList();
							this.dialogFormVisible=false;
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
