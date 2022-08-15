<template>
	<div class="customerManagerList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>客户管理列表</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
				<el-form-item label="客户名称">
					<el-input v-model="searchForm.customerName" placeholder="请输入客户名称"></el-input>
				</el-form-item>
                <el-form-item label="客户手机号">
					<el-input v-model="searchForm.customerPhone" placeholder="请输入客户手机号" maxlength="11"></el-input>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
				<el-button type="primary" @click="add">新增客户</el-button>
				<el-button type="primary" @click="notVipConsume">创建非会员消费记录</el-button>
				</el-form>
			</el-row>
		</el-row>
		<el-row class="M_table">
			<el-empty v-if="list.length==0" description="暂无数据"></el-empty>
			<div v-else  class="table_page_contain">
				<el-table :data="list" border header-cell-class-name="table-cell header-cell" :max-height="$store.state.common.main.TableBodyHeight">
					<el-table-column prop="customerName" label="客户名称">
					</el-table-column>
					<el-table-column prop="customerPhone" label="客户手机号">
					</el-table-column>
                    <el-table-column prop="rechargeAmount" label="累计金额">
					</el-table-column>
					<el-table-column prop="residue" label="剩余金额">
					</el-table-column>
                    <el-table-column prop="memberName" label="vip级别">
					</el-table-column>
                    <el-table-column prop="remark" label="备注信息">
                        <template slot-scope="scope">
							<el-tooltip class="item" effect="light" :content="scope.row.remark" placement="bottom-start">
							<span>{{scope.row.remark}}</span>
						</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="265">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="vipConsume(scope.row)">创建消费</el-button>
                            <el-button type="text" size="small" @click="handleView(scope.row)">消费记录</el-button>
							<el-button type="text" size="small" @click="rechargeView(scope.row)">充值记录</el-button>
							<el-button type="text" size="small" @click="recharge(scope.row)">充值</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%">
			<el-form :rules="rules" ref="customerForm" :model="customerForm" label-width="110px">
                <el-form-item label="客户姓名" prop="customerName">
					<el-input v-model="customerForm.customerName" placeholder="请输入客户姓名"></el-input>
				</el-form-item>
                <el-form-item label="客户手机号" prop="customerPhone">
					<el-input v-model="customerForm.customerPhone" placeholder="请输入客户手机号" maxlength="11"></el-input>
				</el-form-item>
                <el-form-item label="备注">
					<el-input type="textarea" v-model="customerForm.remark" placeholder="请输入备注"></el-input>
				</el-form-item>
                <el-form-item label="充值金额" prop="rechargeAmount">
					<el-input v-model="customerForm.rechargeAmount" placeholder="请输入金额"><template slot="append">元</template></el-input>
				</el-form-item>
                <el-form-item label="会员等级" prop="memberId">
					<el-select v-model="customerForm.memberId" placeholder="请选择">
						<el-option v-for="(item,index) in vipList" :key="index" :label="item.memberName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>
        <el-dialog title="充值" :visible.sync="dialogRechargeVisible" width="40%">
			<el-form ref="rechargeForm" :rules="rules" :model="rechargeForm" label-width="110px">
                <el-form-item label="客户姓名">
					<el-input disabled v-model="rechargeForm.customerName" placeholder="请输入客户姓名"></el-input>
				</el-form-item>
                <el-form-item label="客户手机号">
					<el-input disabled v-model="rechargeForm.customerPhone" placeholder="请输入客户手机号"></el-input>
				</el-form-item>
                <el-form-item label="账户金额">
					<el-input disabled v-model="rechargeForm.residue" placeholder="请输入金额"><template slot="append">元</template></el-input>
				</el-form-item>
                <el-form-item label="累计充值金额">
					<el-input disabled v-model="rechargeForm.rechargeAmount" placeholder="请输入金额"><template slot="append">元</template></el-input>
				</el-form-item>
                <el-form-item label="充值金额" prop="charge">
					<el-input v-model="rechargeForm.charge" placeholder="请输入金额"><template slot="append">元</template></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogRechargeVisible = false">取 消</el-button>
				<el-button type="primary" @click="rechargeRecordsAdd">确 定</el-button>
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
	customerName,
	customerPhone,
	rechargeAmount,
	charge,
	memberId
} from '@/assets/js/rules/container.js'
export default {
	name:'customerManagerList',
	components: {
		Page,
		upload
	},
	data(){
		return {
			Defined,
			searchForm: {
				customerName:'',
				customerPhone:''
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 0,
			form:{},
			rechargeForm:{
				charge:''
			},
			dialogFormVisible: false,
            dialogRechargeVisible:false,
            publishStatus:[],
            title:'新增客户',
			rules:{
				customerName,
				customerPhone,
				rechargeAmount,
				charge,
				memberId
			},
			customerForm:{
				rechargeAmount:''
			},
			vipList:[],
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
                path:'/customerManagerList',
                query:{
                    customerName: this.searchForm.customerName || '',
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
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize
            })
            this.$axiosJson.post(INTERFACE.merchantCustomerList,
                queryParams
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
            })
        },
        add(){
            this.dialogFormVisible=true;
            this.title="新增客户";
			this.status='add';
			this.$nextTick(()=>{
				this.$refs.customerForm.resetFields();
				this.customerForm = this.$options.data.call(this).customerForm;
			})
			this.merchantVipLevelList();
        },
		//新增-查询会员等级
		merchantVipLevelList(){
			this.$axiosJson.post(INTERFACE.merchantVipLevelList,{
				merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : ''
			})
			.then(res=>{
				if(res.data.code == STATUSCODE.code01){
					this.vipList = res.data.data || [];
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		//编辑客户信息
        handleEdit(row){
            this.dialogFormVisible=true;
            this.title="编辑客户";
			this.status='edit';
			this.$nextTick(()=>{
				this.$refs.customerForm.resetFields();
			})
			this.merchantVipLevelList();
			this.merchantCustomerDetailsDetail(row);//获取详情
        },
		merchantCustomerDetailsDetail(row){
			this.$axios.get(INTERFACE.merchantCustomerDetailsDetail,{
				params:{
					id:row.id
				}
			}).then(res=>{
				if(res.data.code == STATUSCODE.code01){
					if(this.status == 'edit'){
						this.customerForm = res.data.data;
					}
					if(this.status == 'recharge'){
						this.rechargeForm = res.data.data;
					}
				}
			}).catch(err=>{
				console.log(err);
			})
		},
		//充值弹窗
        recharge(row){
            this.dialogRechargeVisible=true;
			this.status = 'recharge';
			this.merchantCustomerDetailsDetail(row);
        },
		//创建会员消费
        vipConsume(row){
            this.$router.push({
                path:'/vipConsume',
				query:{
					data: JSON.stringify(row)
				}
            })
        },
		//客户消费记录
		handleView(row){
			this.$router.push({
				path:'/consumeList',
				query:{
					id:row.id
				}
			})
		},
		//客户充值记录
		rechargeView(row){
			this.$router.push({
				path:'/rechargeList',
				query:{
					id:row.id
				}
			})
		},
		//创建非会员消费
        notVipConsume(){
            this.$router.push({
                path:'/notVipConsume'
            })
        },
		//新增客户
		submitForm(){
			this.$refs['customerForm'].validate(valid=>{
				if(valid){
					const obj={}
					Object.assign(obj,this.customerForm,{
						rechargeAmount: Number(this.customerForm.rechargeAmount)
					});
					delete obj.createTime;
					delete obj.updateTime;
					let url=this.status == 'add'?INTERFACE.merchantCustomerDetailsAdd : INTERFACE.merchantCustomerDetailsUpdate;
					this.$axiosJson.post(url,obj
					).then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.getList();
							this.dialogFormVisible = false;
						}
					}).catch(err=>{
						console.log(err);
					})
				}
			})
		},
		//充值
		rechargeRecordsAdd(){
			this.$refs['rechargeForm'].validate(valid=>{
				if(valid){
					const obj={}
					Object.assign(obj,{
						customerName: this.rechargeForm.customerName,
						customerPhone: this.rechargeForm.customerPhone,
						customerId: this.rechargeForm.id,
						charge: Number(this.rechargeForm.charge)
					});
					this.$axiosJson.post(INTERFACE.rechargeRecordsAdd,obj
					).then(res=>{
						if(res.data.code == STATUSCODE.code01){
							this.$message.success(res.data.message);
							this.getList();
							this.dialogRechargeVisible=false;
						}
					}).catch(err=>{
						console.log(err);
					})
				}
			})
		}
	}
}
</script>
