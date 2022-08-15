<template>
	<div class="serviceManagerList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>服务列表管理</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
				<el-form-item label="服务名称">
					<el-input v-model="searchForm.serviceName" placeholder="请输入服务名称"></el-input>
				</el-form-item>
                <el-form-item label="发布状态">
					<el-select v-model="searchForm.status" placeholder="请选择" :clearable="true">
                        <el-option
                        v-for="item in $store.state.container.enumList.publishStatus"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
				<el-button type="primary" @click="add">新增服务</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else  class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column prop="serviceName" label="服务名称">
					</el-table-column>
					<el-table-column prop="servicePrice" label="单价">
					</el-table-column>
                    <el-table-column prop="onlineServicePrice" label="发布价格">
					</el-table-column>
					<el-table-column prop="status" label="服务状态">
						<template slot-scope="scope">
							{{$store.getters.getPublicStatus(scope.row.status,'publishStatus')}}
						</template>
					</el-table-column>
                    <el-table-column prop="categoryName" label="服务分类">
					</el-table-column>
                    <el-table-column prop="serviceImages" label="服务图片">
						<template slot-scope="scope">
							<img :src="scope.row.serviceImages" alt="" width="100" height="80">
						</template>
					</el-table-column>
                    <el-table-column prop="introduce" label="服务介绍">
                        <template slot-scope="scope">
							<el-tooltip class="item" effect="light" :content="scope.row.introduce" placement="bottom-start">
							<span>{{scope.row.introduce}}</span>
						</el-tooltip>
						</template>
					</el-table-column>
                    <el-table-column prop="createTime" label="创建日期">
					</el-table-column>
                    <el-table-column prop="updateTime" label="更新日期">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="250">
						<template slot-scope="scope">
							<el-button v-if="scope.row.status != 2 " type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button v-if="scope.row.status == 0 " type="text" size="small" @click="handleUp(scope.row)">上架</el-button>
                            <el-button v-if="scope.row.status == 2 " type="text" size="small" @click="handleDown(scope.row)">下架</el-button>
                            <el-button v-if="scope.row.status == 3 " type="text" size="small" @click="handleReason(scope.row)">显示驳回理由</el-button>
							<el-button v-if="scope.row.status != 2 " type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogFormVisible" width="50%">
			<el-form ref="serviceForm" :rules="rules" :model="serviceForm" label-width="135px">
				<el-form-item label="服务项目" prop="serviceName">
					<el-input v-model="serviceForm.serviceName" placeholder="请输入服务项目"></el-input>
				</el-form-item>
                <el-form-item label="服务分类" prop="categoryId">
					<el-select v-model="serviceForm.categoryId" placeholder="请选择">
						<el-option v-for="item in serviceTypeList" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
                <el-form-item label="单价" prop="servicePrice">
					<el-input v-model="serviceForm.servicePrice" placeholder="请输入单价"><template slot="append">元</template></el-input>
				</el-form-item>
                <el-form-item label="线上价格" prop="lineServicePrice">
					<el-input  v-model="serviceForm.lineServicePrice" placeholder="请输入线上价格"><template slot="append">元</template></el-input>
				</el-form-item>
                <el-form-item label="上传图片">
					<upload
						:accept="['png','jpg','jpeg']"
						:limit="1"
						:uploadUrl="uploadUrl"
						:requestParam="{}"
						:uploadList="fileList"
					>
					</upload>
				</el-form-item>
                <el-form-item label="服务介绍">
					<el-input type="textarea" v-model="serviceForm.introduce" placeholder="请输入服务介绍"></el-input>
				</el-form-item>
                <el-form-item label="是否支持会员折扣" prop="shareVip">
					<el-select v-model="serviceForm.shareVip" placeholder="请选择">
						<el-option v-for="(item,index) in $store.state.container.enumList.isVipDiscount" :key="index" :label="item.name" :value="item.code"></el-option>
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
	serviceName,
	categoryId,
	servicePrice,
lineServicePrice,
shareVip
} from '@/assets/js/rules/container.js'
export default {
	name:'serviceManagerList',
	components: {
		Page,
		upload
	},
	data(){
		return {
			uploadUrl: INTERFACE.ossUpload,
			Defined,
			searchForm: {
				serviceName:'',
				status:''
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 0,
			serviceForm:{
				serviceName:'',
				categoryId:'',
				servicePrice:null,
				lineServicePrice:null,
				introduce:'',
				shareVip:''
			},
			dialogFormVisible: false,
            publishStatus:[],
            title:'新增服务类型',
			rules:{
				serviceName,
				categoryId,
				servicePrice,
				lineServicePrice,
				shareVip
			},
			serviceTypeList:[],
			currentRow:null,
			fileList:[]
		}
	},
	watch:{
        '$route.query':function(newVal,oldVal){
            this.getList();
			this.merchantCategoryAll();
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
			this.merchantCategoryAll();
		},	
		merchantCategoryAll(){
			this.$axios.get(INTERFACE.merchantCategoryAll).then(res=>{
                if(res.data.code == STATUSCODE.code01){
					this.serviceTypeList=res.data.data || [];
                }
            }).catch(error=>{
                console.log(error);
            })
		},
		doSearch(pageData){
            this.$router.push({
                path:'/serviceManagerList',
                query:{
					serviceName: this.searchForm.serviceName || '',
                    status: this.searchForm.status === '' ? '' : this.searchForm.status,
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
				status: queryParams.status === '' || queryParams.status==undefined ? '': queryParams.status * 1,
                pageNumber:Number(queryParams.pageNumber) || 1,
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize,
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
            })
            this.$axiosJson.post(INTERFACE.merchantServicesList,queryParams
            ).then(res=>{
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
				this.searchForm.status = this.searchForm.status ==='' || this.searchForm.status == undefined? '': Number(this.searchForm.status)
            })
        },
        add(){
            this.dialogFormVisible=true;
            this.title="新增服务类型";
			this.fileList = [];
			this.currentRow=null;
			this.$nextTick(()=>{
				this.$refs['serviceForm'].resetFields();
				this.serviceForm = this.$options.data.call(this).serviceForm;
			})
        },
        handleEdit(row){
            this.dialogFormVisible=true;
            this.title="编辑服务类型";
			this.$nextTick(()=>{
				this.$refs['serviceForm'].resetFields();
				this.currentRow=row;

			})
			this.$axios.get(INTERFACE.merchantServicesDetail,{
				params:{
					serviceId:row.id
				}
			}).then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.serviceForm = res.data.data;
					this.$set(this.serviceForm,'lineServicePrice',this.serviceForm.onlineServicePrice)
					this.fileList = [];
					if(this.serviceForm && this.serviceForm.serviceImages){
						this.fileList.push({
							url: this.serviceForm.serviceImages,
							uid: new Date().getTime()
						})
					}
				}
			}).catch(error=>{
				console.log(error);
			})
        },
        handleUp(row){
			let obj = {};
			this.$axios.get(INTERFACE.merchantServicesUp,{
				params:{
					serviceId:row.id
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
        handleDown(row){
            this.$axios.get(INTERFACE.merchantServicesDown,{
				params:{
					serviceId:row.id
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
        handleReason(row){
			this.$alert(row.reason, '驳回理由', {
				confirmButtonText: '确定'
			});
        },
        handleDel(row){
            this.$confirm('请确认是否删除该数据, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.get(INTERFACE.merchantServicesDelete,{
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
		submitForm(){
			this.$refs['serviceForm'].validate(valid=>{
				if(valid){
					let obj = {};
					Object.assign(obj, this.serviceForm, {
						id:this.serviceForm.id ? this.serviceForm.id : '',
						serviceImages: this.fileList.length > 0 ? this.fileList[0].url : '',
						servicePrice: this.serviceForm.servicePrice?Number(this.serviceForm.servicePrice): 0,
						lineServicePrice: this.serviceForm.lineServicePrice?Number(this.serviceForm.lineServicePrice): 0,
						categoryId:this.serviceForm.categoryId,
						categoryName: this.serviceTypeList.find(item => item.id == this.serviceForm.categoryId).categoryName
					})
					if(!obj.serviceImages){
						this.$message.warning("请上传图片");
						return false;
					}
					this.$axiosJson.post(INTERFACE.merchantServicesAdd,obj).then(res=>{
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

