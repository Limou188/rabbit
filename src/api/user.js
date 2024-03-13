import request from "@/utils/request"

// * 帐号登录
// * @param {String} account - 用户名
// * @param {String} password - 密码
// * @returns Promise

export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

// * 短信登录
// * @param {String} mobile - 手机号
// * @param {String} code - 验证码
// * @returns Promise

export const userMobileLogin = ({mobile,code}) => {
  return request('/login/code','post',{mobile,code})
}

// * 获取短信登录验证码
// * @param {String} mobile - 手机号
// * @returns Promise

export const userMobileLoginMsg = (mobile) => {
  return request('/login/code','get',{mobile})
}

// * 合并本地购物车
// * @param {Array<object>} cartList - 本地购物车数组
// * @param {String} item.skuId - 商品SKUID
// * @param {Boolean} item.selected - 是否选中
// * @param {Integer} item.count - 数量
export const mergeLocalCart = (cartList) => {
  return request('/member/cart/merge','post',cartList)
}

/**
 * 获取用户信息
 * @returns Promise
 */
export const getUserInfo = () => {
  return request('/member/profile','get')
}

/**
 * 修改用户信息
 * @param {Object} formData - 用户信息
 */
export const updateUserInfo = (formData) => {
  return request('/member/profile','put',formData)
}

/**
 * 修改用户头像
 * @param {file} formData - 用户头像
 */
export const updatePortrait = (formData) => {
  return request('/member/profile/avatar','post',formData)
}

/**
 * 获取验证码
 * @param {string} mobile - 手机号
 * @param {string} type - 验证码类型
 * */
export const getVerifyCode = (mobile,type) => {
  return request('/code','get',{mobile,type})
}

/**
 * 用户注册
 * @param {string} formData - 用户信息
 */
export const userRegister = (formData) => {
  return request('/register','post',formData)
}