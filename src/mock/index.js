// 引入mockjs
import Mock from 'mockjs'
import qs from 'qs'


//MOck的配置
Mock.setup({
  // 随机延迟500~1000毫秒
  timeout:'500-1000'
})

// 拦截请求,
// 第一个参数：url，使用正则去匹配
// 第二个参数，请求方式
// 第三个参数: 生成的数据函数
Mock.mock(/\/my\/test/,'get',()=> {
  return { msg:'请求测试接口成功',result:[]}
})

// 单个数据
Mock.mock('@/integer(0,7)')

// 对象数据
Mock.mock({
  id:'@id',
  name:'@ctitle(2,4)'
})

// 模拟 我的收藏
Mock.mock(/\/member\/collect/,'get',config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for(let i = 0;i < +queryObject.pageSize;i++){
    items.push(Mock.mock({
      id:'@id',
      name:'@ctitle(10,20)',
      price:'@integer(100,200,2,2)',
      // http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_7.jpg
      picture:`http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg:'获取收藏商品成功',
    result: {
      counts:35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.page,
      items
    }
  }
})