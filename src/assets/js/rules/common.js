import validator from 'validator';
const checkPhone = (rule,value,callback)=>{
    if(!(value && validator.isMobilePhone(value.toString(), 'zh-CN'))){
        return callback(new Error('手机号码格式有误'))
    }else{
        callback()
    }
}
export const userName = [
    {required: true, message: '请输入用户名',trigger: 'blur'},
    {pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message :'用户名需为中英文', trigger: 'blur'}
]
export const phoneNumber = [
    {required: true, message: '请输入手机号',trigger: 'blur'},
    {pattern: /^1[3456789]\d{9}$/ , message: '手机号码格式有误', trigger: 'blur'}
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