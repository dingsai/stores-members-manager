import container from "../modules/index.js";
export default [
  {path:"/index", name:"index", component:container.index},//首页
  {path:"/updateMerchantInfo", name:"updateMerchantInfo", component:container.updateMerchantInfo},//修改店铺信息
  {path:"/serviceCategoryList", name:"serviceCategoryList", component:container.serviceCategoryList},//服务分类
  {path:"/employeeManagerList", name:"employeeManagerList", component:container.employeeManagerList},//员工管理列表
  {path:"/employeeRecordList", name:"employeeRecordList", component:container.employeeRecordList},//员工服务记录
  {path:"/orderManagerList", name:"orderManagerList", component:container.orderManagerList},//预约管理-列表
  {path:"/vipLevelManagerList", name:"vipLevelManagerList", component:container.vipLevelManagerList},//会员等级列表
  {path:"/serviceManagerList", name:"serviceManagerList", component:container.serviceManagerList},//服务管理列表
  {path:"/customerManagerList", name:"customerManagerList", component:container.customerManagerList},//客户管理列表
  {path:"/rechargeList", name:"rechargeList", component:container.rechargeList},//客户充值记录
  {path:"/consumeList", name:"consumeList", component:container.consumeList},//客户消费记录
  {path:"/vipConsume", name:"vipConsume", component:container.vipConsume},//客户-创建会员消费
  {path:"/notVipConsume", name:"notVipConsume", component:container.notVipConsume},//客户-创建非会员消费
]
