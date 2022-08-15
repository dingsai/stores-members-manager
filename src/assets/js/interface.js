const api = '/merchant';
export default {
    register: api + '/login/register',//用户注册
    login: api + '/login/merchant',//用户登录
    logout: api + '/login/logout',//退出登录

    merchantMessageQuery: api +'/merchantMessage/query',//查询店铺信息
    merchantMessageUpdate: api +'/merchantMessage/update',//更新店铺信息
    updatePassWord: api +'/merchantMessage/updatePassWord',//修改密码

    ossUpload: api +'/oss/upload',//上传
    merchantCategory: api +'/merchantCategory/query',//查询店铺分类
    merchantCategoryAll: api + '/merchantServicesCategory/query',//查询所有服务分类


    servicesCategoryList: api + '/merchantServicesCategory/queryPage',//获取服务分类列表
    servicesCategoryAdd: api + '/merchantServicesCategory/add',//添加服务分类
    servicesCategoryDetail: api + '/merchantServicesCategory/detail',//服务详情
    servicesCategoryDel: api + '/merchantServicesCategory/delete',//删除服务分类
    servicesCategoryChangeStatus: api + '/merchantServicesCategory/changeStatus',//修改服务分类状态

    merchantStaffList: api + '/merchantStaff/query',//员工列表
    merchantStaffAdd: api + '/merchantStaff/add',//员工新增
    merchantStaffDel: api + '/merchantStaff/delete',//员工删除
    merchantStaffDetail: api + '/merchantStaff/detail',//员工详情
    merchantStaffUpdate: api + '/merchantStaff/update',//员工更新
    // merchantStaffList: api + '/merchantStaff/query',//员工服务记录列表

    SubscribeServicesList: api + '/merchantSubscribeServices/query',//预约列表
    merchantStaffAll: api + '/merchantStaff/queryAll',//预约-服务人员
    merchantSubscribeServicesComplete: api + '/merchantSubscribeServices/complete',//预约-完成预约
    merchantSubscribeServicesRefuse: api + '/merchantSubscribeServices/refuse',//预约-拒绝

    merchantVipLevelList: api + '/merchantVipLevel/query',//会员级别-列表
    merchantVipLevelAdd: api + '/merchantVipLevel/add',//会员级别-添加
    merchantVipLevelDetail: api + '/merchantVipLevel/detail',//会员级别-详情
    merchantVipLevelUpdate: api + '/merchantVipLevel/update',//会员级别-更新
    merchantVipLevelDelete: api + '/merchantVipLevel/delete',//会员级别-删除


    merchantServicesList: api + '/merchantServices/query',//服务管理-列表
    merchantServicesDetail: api + '/merchantServices/detail',//服务管理-详情
    merchantServicesUp: api + '/merchantServices/release',//服务管理-上架
    merchantServicesDown: api + '/merchantServices/down',//服务管理-下架
    merchantServicesAdd: api + '/merchantServices/add',//服务管理-添加
    merchantServicesDelete: api + '/merchantServices/delete',//服务管理-删除

    merchantCustomerList: api + '/merchantCustomerDetails/query',//客户管理-列表

    
    merchantCustomerDetailsAdd: api + '/merchantCustomerDetails/add',//客户管理-添加客户
    merchantCustomerDetailsUpdate: api + '/merchantCustomerDetails/update',//客户管理-添加客户
    merchantCustomerDetailsDetail: api + '/merchantCustomerDetails/detail',//客户管理-详情
    merchantServicesAll: api + '/merchantServices/queryAll',//创建消费-服务列表
    vipExpenseCalendarAdd: api + '/vipExpenseCalendar/add',//客户管理-创建会员消费
    vipExpenseCalendar: api + '/vipExpenseCalendar/query',//客户管理-会员-消费记录
    ordinaryConsumerRecords: api + '/ordinaryConsumerRecords/query',//客户管理-非会员-消费记录

    ordinaryConsumerRecordsAdd: api + '/ordinaryConsumerRecords/add',//客户管理-创建非会员消费

    rechargeRecordsAdd: api + '/rechargeRecords/add',//客户管理-充值
    rechargeRecordsQuery: api + '/rechargeRecords/query',//客户管理-充值记录
    

}