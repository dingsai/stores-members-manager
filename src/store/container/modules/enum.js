export default {
	state: {
		serviceEnableStatus:[{
			code:0,
			name:'启用'
		},{
			code:1,
			name:'禁用'
		}],
		EmployeeStatus:[{
			code:0,
			name:'在职'
		},{
			code:1,
			name:'离职'
		}],
		//0:已预约，1:完成预约，2:取消预约，3：商家拒绝
		orderType:[{
			code:0,
			name:'已预约'
		},{
			code:1,
			name:'完成预约'
		},{
			code:2,
			name:'取消预约'
		},{
			code:3,
			name:'商家拒绝'
		}],
		publishStatus:[{
			code:0,
			name:'待上线'
		},{
			code:1,
			name:'待审核'
		},{
			code:2,
			name:'已上线'
		},{
			code:3,
			name:'审核未通过'
		}],
		isVipDiscount:[{
			code:0,
			name:'是'
		},{
			code:1,
			name:'否'
		}],
		payTypeList:[{
			code:1,
			name:'现金支付'
		},{
			code:2,
			name:'余额支付'
		}],
	},
	getters: {
		getPublicStatus: (state) => (code,obj) => {
			let data=state[obj].find(item=> item.code == code);
			return data ? data.name : ''; 
		}
	},
	mutations: {
		
	},
	actions: {
	
	},
	modules: {
		
	}
}
