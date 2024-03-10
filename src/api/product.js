import request from "@/utils/request"


// 获取商品详情的数据

export const findGoods = (id) =>{//发get请求找到和id相对应的数据
  return request('/goods','get',{id})
}