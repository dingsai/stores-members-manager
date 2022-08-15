import validator from 'validator';
export const storeName = [
    {required: true, message: '请输入商家名称',trigger: 'blur'},
    // {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message :'商家名称需为中英文', trigger: 'blur'}
]
export const storeClassify = [
    {required: true, message: '请选择商家分类',trigger: 'change'}
]
export const selectedOptions = [
    {required: true, message: '请选择地址',trigger: 'change'}
]
export const detailsAddress = [
    {required: true, message: '请输入详细地址',trigger: 'blur'}
]

export const passWord = [
    {required: true, message: '请输入密码',trigger: 'blur'},
    {min:6 , message: '密码最少为6位', trigger: 'blur'}
]
export const account = [
    {required: true, message: '请输入账号',trigger: 'blur'}
]
export const verifyCode = [
    {required: true, message: '请输入验证码',trigger: 'blur'},
]

export const refuseMessage = [
    {required: true, message: '请输入拒绝理由',trigger: 'blur'},
]
export const serviceStaff = [
    {required: true, message: '请选择服务人员',trigger: 'change'},
]

export const memberName = [
    {required: true, message: '请输入会员级别,例如：一级会员',trigger: 'blur'},
]
export const memberDiscount = [
    {required: true, message: '请输入会员折扣',trigger: 'blur'},
    {pattern: /^(0\.(?!0+$)\d{1,2}|1(\.0{1,2})?)$/, message: '请输入大于0且小于等于1的两位小数或整数',trigger: 'blur'},
]
export const serviceName = [
    {required: true, message: '请输入服务项目',trigger: 'blur'}
]
export const categoryId = [
    {required: true, message: '请选择服务分类',trigger: 'change'}
]
export const servicePrice = [
    {required: true, message: '请输入金额',trigger: 'blur'},
    {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额需大于0,最多保留两位小数',trigger: 'blur'},
]
export const lineServicePrice = [
    {required: true, message: '请输入金额',trigger: 'blur'},
    {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额需大于0,最多保留两位小数',trigger: 'blur'},
]
export const shareVip = [
    {required: true, message: '请选择是否支持会员折扣',trigger: 'change'}
]


export const staffName = [
    {required: true, message: '请输入员工姓名',trigger: 'blur'},
    {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message :'员工姓名需为中英文', trigger: 'blur'}
]
export const staffPhone = [
    {required: true, message: '请输入手机号',trigger: 'blur'},
    {pattern: /^1[3456789]\d{9}$/ , message: '手机号码格式有误', trigger: 'blur'}
]

export const rechargeAmount = [
    {required: true, message: '请输入金额',trigger: 'blur'},
    {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额需大于0,最多保留两位小数',trigger: 'blur'},
]

export const customerName = [
    {required: true, message: '请输入客户姓名',trigger: 'blur'},
    {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message :'客户姓名需为中英文', trigger: 'blur'}
]
export const customerPhone = [
    {required: true, message: '请输入手机号',trigger: 'blur'},
    {pattern: /^1[3456789]\d{9}$/ , message: '手机号码格式有误', trigger: 'blur'}
]

export const charge = [
    {required: true, message: '请输入金额',trigger: 'blur'},
    {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '金额需大于0,最多保留两位小数',trigger: 'blur'},
]
export const memberId = [
    {required: true, message: '请选择会员等级',trigger: 'change'}
]