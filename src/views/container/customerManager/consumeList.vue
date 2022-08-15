<template>
	<div class="consumeList">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>客户消费记录</span>
			</el-row>
			<el-row class="M_search">
				<el-form :inline="true" :model="searchForm" size="small" class="demo-form-inline" label-width="100px" label-position="right">
                <el-form-item label="日期">
					 <el-date-picker
						v-model="searchForm.dateTime"
						type="daterange"
						align="right"
						unlink-panels
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:picker-options="Defined.Date.pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="doSearch(1)">查询</el-button>
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
                    <el-table-column prop="memberName" label="vip级别">
					</el-table-column>
					<el-table-column prop="servicesName" label="服务名称">
					</el-table-column>
                    <el-table-column prop="serviceNumber" label="服务次数">
					</el-table-column>
                    <el-table-column prop="serviceStaff" label="服务人员">
					</el-table-column>
					<el-table-column prop="sumOfConsumption" label="消费金额">
					</el-table-column>
					<el-table-column prop="createTime" label="消费时间">
					</el-table-column>
				</el-table>
				<el-row class="M_page" v-if="total && total > 0">
					<Page ref="Page"  class="fr" :total="total" :pageSize="pageSize"  :currentPage="currentPage" @changePageSize="doSearch"></Page>
				</el-row>
			</div>
		</el-row>
	</div>
</template>

<script>
import Page from '@/components/page.vue'
import INTERFACE from '@/assets/js/interface.js'
import {STATUSCODE, Defined} from '@/assets/js/defined.js'
export default {
	name:'consumeList',
	components: {
		Page,
	},
	data(){
		return {
			Defined,
			searchForm: {
				dateTime: ['','']
			},
			list: [],
			total: 0,
            currentPage: 1,
            pageSize: 0,
			form:{},
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
                path:'/consumeList',
                query:{
					id:this.$route.query.id,
                    startTime: this.searchForm.dateTime && this.searchForm.dateTime.length>0? this.Defined.Date.timeToDate(this.searchForm.dateTime[0],'hms') : null,
					endTime: this.searchForm.dateTime && this.searchForm.dateTime.length>0? this.Defined.Date.timeToDate(this.searchForm.dateTime[1],'hms') : null,
                    pageNumber: (pageData && pageData.pageCurrent) || 1,
                    pageSize: (pageData && pageData.pageSize) || this.$store.state.common.main.pageSize,
                }
            })
        },
        getList(){
            let queryParams=this.$route.query;
            this.pageSize=Number(queryParams.pageSize);
            this.updateParams(queryParams);
            Object.assign(queryParams,{
				startTime: queryParams.startTime || '',
				endTime: queryParams.endTime || '',
				id:this.$route.query.id,
                pageNumber:Number(queryParams.pageNumber) || 1,
                pageSize:Number(queryParams.pageSize) || this.$store.state.common.main.pageSize
            })

			// let url = this.$router.query.isVip? INTERFACE.vipExpenseCalendar: INTERFACE.ordinaryConsumerRecords;
            this.$axiosJson.post(INTERFACE.vipExpenseCalendar,queryParams
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
				if(params.startTime && params.endTime){
					this.searchForm.dateTime = [params.startTime, params.endTime];
				} else {
					this.searchForm.dateTime = [];
				}
            })
        },
	}
}
</script>
