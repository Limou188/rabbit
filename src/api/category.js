// 定义首页需要的接口函数
import request from "@/utils/request";


//获取首页头部分类数据
export const findAllCategory = () =>{
  return request('/home/category/head','get')
}
//上面代码等价于下面代码
// export function login(data) {
//   return request({
//     url: '/home/category/head',
//     method: 'get',
//     data
//   })
// }


// 获取单个顶级分类信息
// @param {String} id - 顶级分类ID
// 请求跟传参id相等的那项数据
export const findTopCategory  = (id) =>{
  return request('/category','get',{id})
}

// 获取二级分类筛选条件数据
// @param {String} id - 二级分类ID
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', {id})
}

// 获取分类下的商品（附带筛选条件）
// @param {Object} params - 可参考接口文档
// post请求将接收的参数params添加到原数据中，并把更新后的数据返回
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}