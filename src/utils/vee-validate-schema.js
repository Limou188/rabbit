// 定义校验规则提供给vee-validate组件使用
export default {
  // 校验account
  account(value){
    // value 是将来使用该规则的表单元素的值
    // 1.必填项
    // 2.6~20个字符，需要以字母开头
    // 如何反馈校验成功还是失败，反回true是成功，其他情况失败，返回失败原因
    if(!value)return '请输入用户名'
    if(!/^[a-zA-Z]\w{5,19}$/.test(value))return '用户名需要6~20个字符,且以字母开头'
    return true
  },
  // 校验password
  password(value){
    if(!value)return '请输入密码'
    if(!/^\w{6,24}$/.test(value))return '密码需要6~24个字符'
    return true
  },

  mobile(value){
    if(!value)return '请输入手机号码'
    if(!/^1[3-9]\d{9}$/.test(value))return '手机号码格式错误'
    return true
  },  
  code(value){
    if(!value)return '请输入验证码'
    if(!/^\d{6}$/.test(value))return '验证码格式错误,(随便输6个数字)'
    return true
  },
  isAgree(value){
    if(!value)return '请勾选用户协议'
    return true
  }
}