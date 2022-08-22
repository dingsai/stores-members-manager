<template>
	<div class="orderManagerList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>预约列表</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline searchForm" label-width="100px" label-position="right">
                <el-form-item label="预约时间">
					<el-date-picker
                        v-model="searchForm.subscribeTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
				</el-form-item>
                <el-form-item label="服务">
					<el-select v-model="searchForm.serviceNumber" placeholder="请选择" 
						@change="changeService(searchForm.serviceNumber)"
						filterable
						remote
						reserve-keyword
						:remote-method="handleSelectService"
						:loading="loading"
						:clearable="true">
                        <el-option
                        v-for="item in serviceTypeList"
                        :key="item.categoryId"
                        :label="item.serviceName"
                        :value="item.categoryId">
                        </el-option>
                    </el-select>
				</el-form-item>
                <!-- <el-form-item label="服务人员">
					 <el-select
						v-model="searchForm.serviceStaff"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="handleSelectServiceStaff"
						:loading="loading">
						<el-option
						v-for="item in serviceStaffList"
						:key="item.id"
						:label="item.staffName"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> -->
                <el-form-item label="状态">
					<el-select v-model="searchForm.subscribeStatus" placeholder="请选择" :clearable="true">
                        <el-option
                        v-for="item in $store.state.container.enumList.orderType"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="客户手机号">
					<el-input v-model="searchForm.customerPhone" placeholder="请输入客户手机号" maxlength="11"></el-input>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else  class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column prop="customerPhone" label="客户手机号">
					</el-table-column>
                    <el-table-column prop="subscribePhone" label="预约手机号">
					</el-table-column>
					<el-table-column prop="memberName" label="会员级别" width="120"></el-table-column>
                    <el-table-column prop="serviceName" label="服务" width="120"></el-table-column>
                    <el-table-column prop="servicesNumber" label="服务次数" width="120"></el-table-column>
                    <el-table-column prop="subscribeStatus" label="状态" width="120">
						<template slot-scope="scope">
							{{$store.getters.getPublicStatus(scope.row.subscribeStatus,'orderType')}}
						</template>
					</el-table-column>
					<el-table-column prop="subscribeTime" label="预约时间">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间">
					</el-table-column>
                    <el-table-column prop="customerRemark" label="客户备注">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="light" :content="scope.row.customerRemark" placement="bottom-start">
							<span>{{scope.row.customerRemark}}</span>
						</el-tooltip>
						</template>
					</el-table-column>
                    <el-table-column prop="refuseMessage" label="商家备注">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="light" :content="scope.row.refuseMessage" placement="bottom-start">
							<span>{{scope.row.refuseMessage}}</span>
						</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="120">
						<template slot-scope="scope">
							<el-button v-if="scope.row.subscribeStatus ==0 " type="text" size="small" @click="complete(scope.row)">完成</el-button>
							<el-button v-if="scope.row.subscribeStatus ==0 " type="text" size="small" @click="reject(scope.row)">拒绝</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
		<el-dialog title="拒绝理由" :visible.sync="dialogFormVisible" width="40%">
			<el-form :rules="rules" ref="refuseForm" :model="refuseForm" label-width="100px">
				<el-form-item label="拒绝理由" prop="refuseMessage">
					<el-input type="textarea" v-model="refuseForm.refuseMessage" placeholder="请输入拒绝理由"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="refuseConfirm">确 定</el-button>
			</div>
		</el-dialog>
        <el-dialog title="确认服务人员" :visible.sync="dialogSelectVisible" width="40%">
			<el-form :rules="rules" ref="confirmForm" :model="confirmForm" label-width="100px">
				<el-form-item label="服务人员" prop="serviceStaff">
					<el-select v-model="confirmForm.serviceStaff" placeholder="请选择">
                        <el-option
                        v-for="item in serviceStaffList"
                        :key="item.id"
                        :label="item.staffName"
                        :value="item.id">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="支付方式" prop="payType">
					<el-select v-model="confirmForm.payType" placeholder="请选择">
                        <el-option
                        v-for="item in $store.state.container.enumList.payTypeList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogSelectVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmStaff">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Page from '@/components/page.vue'
import INTERFACE from '@/assets/js/interface.js'
import {STATUSCODE, Defined} from '@/assets/js/defined.js'
import {refuseMessage,serviceStaff,payType} from '@/assets/js/rules/container.js'
export default {
	name:'orderManagerList',
	components: {
		Page
	},
	data(){
		return {
			Defined,
			searchForm: {
				subscribeTime:'',
				serviceNumber:'',
				serviceStaff:'',
				subscribeStatus:'',
				customerPhone:''
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 0,
			refuseForm:{},
			confirmForm:{
				people:'',
				payType:2
			},
			currentRow:null,
			dialogFormVisible: false,
            dialogSelectVisible:false,
			serviceTypeList:[],
			loading:false,
            serviceStaffList:[],
            orderType:[],
			rules:{
				refuseMessage,
				serviceStaff,
				payType
			}
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
			//获取所有服务
			this.merchantServicesAll();
			//获取所有服务人员
			this.merchantStaffAll();
			this.getList();
			
		},	
		handleSelectService(query){
            this.merchantServicesAll(query);
        },
		changeService(val){
			if(!val){
				this.handleSelectService('');
			}
		},
		merchantServicesAll(query){
			this.$axiosJson.post(INTERFACE.merchantServicesAll,{
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : '',
                serviceName: query
			}).then(res=>{
                if(res.data.code == STATUSCODE.code01){
					this.serviceTypeList=res.data.data || [];
                }
            }).catch(error=>{
                console.log(error);
            })
		},
		handleSelectServiceStaff(query) {
			this.merchantStaffAll(query);
		},
		merchantStaffAll(name){
			let params = {}
			Object.assign(params,{
				staffName: name || '',
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
			})
			this.$axiosJson.post(INTERFACE.merchantStaffAll,params).then(res=>{
                if(res.data.code == STATUSCODE.code01){
					this.serviceStaffList=res.data.data || [];
                }
            }).catch(error=>{
                console.log(error);
            })
		},
		doSearch(pageData){
            this.$router.push({
                path:'/orderManagerList',
                query:{
					subscribeTime: this.Defined.Date.timeToDate(this.searchForm.subscribeTime,'hms') || '',
					serviceNumber: this.searchForm.serviceNumber || '',
					subscribeStatus: this.searchForm.subscribeStatus === '' ? '' : this.searchForm.subscribeStatus,
					customerPhone: this.searchForm.customerPhone || '',
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
                pageNumber:Number(queryParams.pageNumber) || 1,
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize,
				serviceNumber:Number(queryParams.serviceNumber) || '',
				subscribeStatus: (queryParams.subscribeStatus === '' || queryParams.subscribeStatus == undefined) ? '' : Number(queryParams.subscribeStatus),
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
			})

            this.$axiosJson.post(INTERFACE.SubscribeServicesList,queryParams
            ).then(res=>{
                if(res.data.code== STATUSCODE.code01){
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

				this.searchForm.serviceNumber= this.searchForm.serviceNumber ? Number(this.searchForm.serviceNumber) : null;
				this.searchForm.serviceStaff= this.searchForm.serviceStaff ? Number(this.searchForm.serviceStaff) : null;
				this.searchForm.subscribeStatus= this.searchForm.subscribeStatus === '' || this.searchForm.subscribeStatus == undefined ? '' : Number(this.searchForm.subscribeStatus)
            })
        },
        complete(row){
			this.dialogSelectVisible=true;
			this.currentRow = row;
        },
		confirmStaff(){
			this.$refs['confirmForm'].validate(valid=>{
				if(valid){
					let obj = {}
					Object.assign(obj,{
						id: this.currentRow.id,
						people:this.confirmForm.serviceStaff,
						payType: this.confirmForm.payType
					})
					this.$axiosJson.post(INTERFACE.merchantSubscribeServicesComplete,obj).then(res=>{
						if(res.data.code== STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.doSearch();
							this.dialogSelectVisible=false;
						}
					}).catch(error=>{
						console.log(error);
					})
				}
			})
		},
        reject(row){
			this.dialogFormVisible=true;
			this.currentRow = row;
        },
		refuseConfirm(){
			this.$refs['refuseForm'].validate(valid=>{
				if(valid){
					let obj = {}
					Object.assign(obj,{
						id: this.currentRow.id,
						refuseMessage: this.refuseForm.refuseMessage
					})
					this.$axiosJson.post(INTERFACE.merchantSubscribeServicesRefuse,obj).then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.doSearch();
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
