<template>
	<div class="employeeList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>员工列表</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
				<el-form-item label="员工姓名">
					<el-input v-model="searchForm.staffName" placeholder="请输入员工姓名"></el-input>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
				<el-button type="primary" @click="Add">新增</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else  class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column prop="staffName" label="员工姓名">
					</el-table-column>
					<el-table-column prop="staffPhone" label="手机号">
					</el-table-column>
					<el-table-column prop="status" label="状态" width="120">
						<template slot-scope="scope">
							{{$store.getters.getPublicStatus(scope.row.status,'EmployeeStatus')}}
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建日期">
					</el-table-column>
					<el-table-column prop="updateTime" label="更新日期">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="200">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
							<el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
			<el-form :rules="rules" ref="form" :model="form" label-width="100px">
				<el-form-item label="员工姓名" prop="staffName">
					<el-input v-model="form.staffName" placeholder="请输入员工姓名"></el-input>
				</el-form-item>
				<el-form-item label="员工手机号" prop="staffPhone">
					<el-input v-model="form.staffPhone" placeholder="请输入员工手机号" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="上传头像">
					<upload
						ref="Upload"
						:accept="['png','jpg','jpeg']"
						:limit="1"
						:uploadUrl="uploadUrl"
						:requestParam="{}"
						:uploadList="fileList"
					>
					</upload>
				</el-form-item>
				<el-form-item label="员工状态">
					<el-select v-model="form.status" placeholder="请选择">
						<el-option
						v-for="item in $store.state.container.enumList.EmployeeStatus"
						:key="item.code"
						:label="item.name"
						:value="item.code">
						</el-option>
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
import upload from '@/components/upload.vue';
import {
	staffName,
	staffPhone
} from '@/assets/js/rules/container.js'
export default {
	name:'employeeManagerList',
	components: {
		Page,
		upload
	},
	data(){
		return {
			uploadUrl: INTERFACE.ossUpload,
			Defined,
			searchForm: {
				staffName:''
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 10,
			form:{
				status:0
			},
			dialogFormVisible: false,
			title:'新增员工',
			status:'add',
			fileList:[],
			rules:{
				staffName,
				staffPhone
			}
		}
	},
	watch:{
        '$route.query':function(newVal,oldVal){
            this.getList();
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
			this.getList();
		},	
		doSearch(pageData){
            this.$router.push({
                path:'/employeeManagerList',
                query:{
                    staffName: this.searchForm.staffName || '',
                    pageNumber: (pageData && pageData.pageCurrent) || 1,
                    pageSize: (pageData && pageData.pageSize) || this.$store.state.common.main.pageSize
                }
            })
        },
        getList(){
            let queryParams=this.$route.query;
            this.pageSize=Number(queryParams.pageSize)
            this.updateParams(queryParams || this.searchForm);
            Object.assign(queryParams,{
				staffName: queryParams.staffName || "",
                pageNumber:Number(queryParams.pageNumber) || 1,
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize || this.$store.state.common.main.pageSize,
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
            })
            this.$axiosJson.post(INTERFACE.merchantStaffList,queryParams).then(res=>{
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
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();
				this.currentRow=row;
			})
			this.title="编辑员工";
			this.status='edit';
			this.$axios.get(INTERFACE.merchantStaffDetail,{
				params:{
					id:row.id
				}
			}).then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.form = res.data.data;
					this.fileList = [];
					if(this.form && this.form.staffImages){
						this.fileList.push({
							url: this.form.staffImages,
							uid: new Date().getTime()
						})
					}
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
				this.$axios.get(INTERFACE.merchantStaffDel,{
					params:{
						id:row.id
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
			this.$nextTick(()=>{
				this.$refs['form'].resetFields();
				this.form = this.$options.data.call(this).form;
			})
			this.title="新增员工";
			this.status='add';
			this.currentRow=null;
			this.fileList = [];
		},
		submitForm(){
			this.$refs['form'].validate(valid=>{
				if(valid){
					Object.assign(this.form,{
						merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : '',
						staffImages: this.fileList.length > 0 ? this.fileList[0].url : ''
					})
					delete this.form.createTime;
					delete this.form.updateTime;
					let url = this.status == 'add'?INTERFACE.merchantStaffAdd:INTERFACE.merchantStaffUpdate;
					this.$axiosJson.post(url,this.form).then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.dialogFormVisible=false;
							this.getList();
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
