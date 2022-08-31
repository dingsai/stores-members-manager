<template>
	<div class="vipConsume">
		<el-row class="M_head">
			<el-row class="M_title">
				<i></i>
				<span>创建会员消费</span>
			</el-row>
			<el-row class="M_contain">
				<el-form :model="vipForm" label-width="110px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户姓名">
                            <el-input disabled v-model="vipForm.customerName" placeholder="请输入客户姓名"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户手机号">
                            <el-input disabled v-model="vipForm.customerPhone" placeholder="请输入客户手机号"></el-input>
                        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="余额">
                            <el-input disabled v-model="vipForm.residue" placeholder="请输入金额"><template slot="append">元</template></el-input>
				        </el-form-item>
                     </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="会员等级">
                            <el-select disabled v-model="vipForm.memberId" placeholder="请选择">
                                <el-option v-for="(item,index) in vipList" :key="index" :label="item.memberName" :value="item.id"></el-option>
                            </el-select>
				        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="服务">
                        <el-row>
                            <el-button type="primary" @click="addService">添加服务</el-button>
                        </el-row>
                        <el-card class="box-card fl mr20 mt20" v-for="(item, index) in vipForm.servicesList" :key="index">
                            <div slot="header" class="clearfix">
                                <span>服务-{{index+1}}</span>
                                <el-button style="float: right; padding: 3px 0" type="text" @click="vipForm.servicesList.splice(index,1)">删除</el-button>
                            </div>
                            <el-form :model="item"  label-width="65px"  class="serviceItem mt20" :inline="true">
                                <el-form-item prop="servicesName" label="服务">
                                    <el-select v-model="item.servicesName" placeholder="请选择" @change="changeService(item.servicesName,item,index)"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :remote-method="handleSelectService"
                                        :loading="loading"
                                        :clearable="true">
                                        <el-option
                                        v-for="item1 in serviceList"
                                        :key="item1.id"
                                        :label="item1.serviceName"
                                        :value="item1.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="price" label="单价">
                                    <el-input disabled v-model="item.price"><template slot="append">元</template></el-input>
                                </el-form-item>
                                <el-form-item prop="vipPrice" label="会员价">
                                    <el-input disabled v-model="item.vipPrice"><template slot="append">元</template></el-input>
                                </el-form-item>
                                <el-form-item prop="serviceStaff" label="员工">
                                    <el-select
                                        v-model="item.serviceStaff"
                                        filterable
                                        remote
                                        reserve-keyword
                                        placeholder="请输入关键词"
                                        :remote-method="handleSelectServiceStaff"
                                        :loading="loading"
                                        :clearable="true">
                                        <el-option
                                        v-for="item in serviceStaffList"
                                        :key="item.id"
                                        :label="item.staffName"
                                        :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="serviceNumber" label="次数">
                                    <el-input-number v-model="item.serviceNumber" :min="0" @change="changeTimes(item.serviceNumber,item,index)"></el-input-number>
                                </el-form-item>
                                <el-form-item prop="sumOfConsumption" label="小记">
                                    <el-input disabled v-model="item.sumOfConsumption"><template slot="append">元</template></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="本次消费">
                            <el-input disabled v-model="vipForm.money" placeholder="请输入金额"><template slot="append">元</template></el-input>
				        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm">创建消费</el-button>
				        </el-form-item>
                    </el-col>
                </el-row>
			</el-form>
			</el-row>
		</el-row>
				
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js'
import {STATUSCODE, Defined} from '@/assets/js/defined.js'
export default {
	name:'vipConsume',
	components: {
	},
	data(){
		return {
			Defined,
			vipForm:{
                servicesList:[{serviceNumber:1}],
                money:0
            },
            loading:false,
            serviceStaffList:[],
            serviceList:[],
            parentRow: {},
            vipList:[]
		}
	},
    watch:{
        'vipForm.servicesList': {
            handler(newVal, oldVal){
                if(newVal && newVal.length > 0){
                    this.vipForm.money = this.vipForm.money ? this.vipForm.money : 0;
                    let money, sum =0;
                    money = newVal.map(item=>{
                        return item.sumOfConsumption ? item.sumOfConsumption : 0
                    })
                    this.vipForm.money = money.reduce(function(pre,curr) {
                        sum=pre+curr;
                        return sum;
                    });
                }
            },
            deep:true
        }
    },
	mounted(){
        this.parentRow = JSON.parse(this.$route.query.data);
        Object.assign(this.vipForm,this.parentRow)
		this.init();
	},
	methods:{
		init(){
            //获取所有服务人员
			this.merchantStaffAll();
            //获取服务
            this.merchantServicesAll();
            //会员等级
            this.merchantVipLevelList();
		},	
        addService(){
            const obj = {
                serviceNumber: 1,
                servicesName:'',
                price:'',
                vipPrice:'',
                serviceNumber:'',
                sumOfConsumption:''
            };
            this.vipForm.servicesList.push(obj);
        },
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
        handleSelectService(query){
            this.merchantServicesAll(query);
        },
        //获取服务
        merchantServicesAll(query){
			this.$axiosJson.post(INTERFACE.merchantServicesAll, {
                merchantId: JSON.parse(sessionStorage.getItem("userInfo")) ? JSON.parse(sessionStorage.getItem("userInfo")).merchantId : '',
                serviceName: query
            }).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.serviceList= res.data.data || [];
                }
            }).catch(error=>{
                console.log(error);
            })
		},
        //获取单价 会员价 小记
        changeService(val,row,index){
            if(val){
                //单价
                Object.assign(row,{
                    price : this.serviceList.find(item => item.id == val).servicePrice
                })
                // 会员价= 是否支持会员折扣？单价 * 会员折扣(接口取)： 单价 * 1
                Object.assign(row,{
                    shareVip : this.serviceList.find(item => item.id == val).shareVip
                })
                Object.assign(row,{
                    vipPrice : row.shareVip == 0 ? row.price * this.vipForm.memberDiscount : row.price * 1
                })
                //小记=本次消费金额=单价*会员折扣*次数
                Object.assign(row,{
                    sumOfConsumption : row.shareVip == 0 ? row.price * this.vipForm.memberDiscount * row.serviceNumber : row.price * 1 * row.serviceNumber
                })
                Object.assign(this.vipForm.servicesList[index],row);
            }
            this.handleSelectService('');
        },
        //更新小记=本次消费金额  =  价格 * 会员折扣 * 次数
        changeTimes(val, row,index){
            Object.assign(row,{
                sumOfConsumption : row.shareVip == 0 ? row.price * this.vipForm.memberDiscount * val : row.price * 1 * val
            })
            Object.assign(this.vipForm.servicesList[index],row)
        },
		submitForm(){
            let obj = {}

            var validItem = true;
            if(this.vipForm.servicesList.length >0 ){
                this.vipForm.servicesList.map(item=>{
                    if(!item.servicesName || !item.serviceStaff){
                        validItem = false;
                    }
                })
            }
            if(!validItem){
                this.$message.warning("请选择服务和员工");
                return false;
            }
            //服务项列表 - 服务 人员都要传字符串
            let servicesList = [];
            servicesList = this.vipForm.servicesList.map(item=>{
                return {
                    servicesName:this.serviceList.find(i => i.id == item.servicesName).serviceName,
                    serviceStaff: this.serviceStaffList.find(i => i.id == item.serviceStaff).staffName,
                    serviceNumber: item.serviceNumber,
                    sumOfConsumption: item.sumOfConsumption
                }
            })
            //校验本次消费是否大于余额   
            if(this.vipForm.money > this.vipForm.residue){
                this.$message.warning("本次消费金额已超过余额,请检查服务项!");
                return false;
            }
            Object.assign(obj, {
                customerName: this.vipForm.customerName,
                customerPhone: this.vipForm.customerPhone,
                id: this.vipForm.id,
                money: this.vipForm.money,
                servicesList: servicesList
            })
            console.log(obj)
            this.$axiosJson.post(INTERFACE.vipExpenseCalendarAdd,obj).then(res=>{
                if(res.data.code == STATUSCODE.code01){
                    this.$message.success(res.data.message);
                    this.$router.push({
                        path:"/customerManagerList"
                    })
                }
            }).catch(err=>{
                console.log(err);
            })
		}
	}
}
</script>
