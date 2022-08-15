import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

export default ({
	state: {
		token:'',
        menuList:[],
		pageSize:10,
		scrollHeight:491+"px",
		TableBodyHeight: 491+"px",
		ops: {
			vuecroll:{
				mode:'native',
			},
			rail: {
				background: '#f5f5f5',
				opacity: 1,
				size: '6px',
				specifyBorderRadius: false,
				gutterOfEnds: null,
				gutterOfSide: '2px',
				keepShow: false
			},
			bar: {
				onlyShowBarOnScroll: true,
				keepShow: false,
				background: '#cccccc',
				opacity: 1,
				hoverStyle: false,
				specifyBorderRadius: false,
				minSize: false,
				size: '6px',
				disable: false,
			}
		},
		menuList:[
			{
				"sourceName": "服务分类",
				"sourceCode": "1--001",
				"id": "1",
				"pid": "0",
				"sourceUrl": "/serviceCategoryList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe71b;",
				"children":[{
					"sourceName": "服务分类",
					"sourceCode": "2--001-001",
					"id": "2",
					"pid": "1",
					"sourceUrl": "/serviceCategoryList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]
				}]				
			},
			{
				"sourceName": "员工管理",
				"sourceCode": "1--002",
				"id": "3",
				"pid": "0",
				"sourceUrl": "/employeeManagerList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe60c;",
				"children":[{
					"sourceName": "员工列表",
					"sourceCode": "2--001-001",
					"id": "4",
					"pid": "3",
					"sourceUrl": "/employeeManagerList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]			
				},
				// {
				// 	"sourceName": "员工服务记录",
				// 	"sourceCode": "2--001-002",
				// 	"id": "5",
				// 	"pid": "3",
				// 	"sourceUrl": "/employeeRecordList",
				// 	"sourceEntry": window.location.origin,
				// 	"icon": "",
				// 	"children":[]			
				// }
			]				
			},
			{
				"sourceName": "预约管理",
				"sourceCode": "1--003",
				"id": "6",
				"pid": "0",
				"sourceUrl": "/orderManagerList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe63e;",
				"children":[{
					"sourceName": "预约列表",
					"sourceCode": "2--001-001",
					"id": "7",
					"pid": "6",
					"sourceUrl": "/orderManagerList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]			
				}]				
			},
			{
				"sourceName": "会员级别管理",
				"sourceCode": "1--004",
				"id": "8",
				"pid": "0",
				"sourceUrl": "/vipLevelManagerList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe6b0;",
				"children":[{
					"sourceName": "商家会员级别",
					"sourceCode": "2--001-001",
					"id": "9",
					"pid": "8",
					"sourceUrl": "/vipLevelManagerList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]			
				}]				
			},
			{
				"sourceName": "服务管理",
				"sourceCode": "1--005",
				"id": "10",
				"pid": "0",
				"sourceUrl": "/serviceManagerList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe605;",
				"children":[{
					"sourceName": "服务列表管理",
					"sourceCode": "2--001-001",
					"id": "11",
					"pid": "10",
					"sourceUrl": "/serviceManagerList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]			
				}]				
			},
			{
				"sourceName": "客户管理",
				"sourceCode": "1--006",
				"id": "12",
				"pid": "0",
				"sourceUrl": "/customerManagerList",
				"sourceEntry": window.location.origin,
				"icon": "&#xe648;",
				"children":[{
					"sourceName": "客户管理列表",
					"sourceCode": "2--001-001",
					"id": "13",
					"pid": "12",
					"sourceUrl": "/customerManagerList",
					"sourceEntry": window.location.origin,
					"icon": "",
					"children":[]			
				}]				
			}
			
		]
	},
	getters: {
		
	},
	mutations: {
		setAllMenuList(state,data){
			state.menuList= data;
		},
		setPageSize(state,data){
			state.pageSize= data;
		},
		setToken(state,data){
			state.token=data;
		}
	},
	actions: {
		
	},
	modules: {
		
	}
})
