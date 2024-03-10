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