import request from "@/utils/request"

// 获取左侧列表品牌
export const findBrand = (limit) => {
  return request('/home/brand','get',{limit})
}
//上面代码等价于下面代码
// export function login(data) {
//   return request({
//     url: '/home/category/head',
//     method: 'get',
//     data：{limit}
//   })
// }

// 获取广告图
export const findBanner = () => {
  return request('home/banner','get')
}

// 新鲜好物
export const findNew = () => {
  return request('home/new','get')
}

// 人气推荐
export const findHot = () => {
  return request('home/hot','get')
}

// 商品区块
export const findGoods = () => {
  return request('home/goods', 'get')
}

// 最新专题
export const findSpecial = () => {
  return request('home/special', 'get')
}