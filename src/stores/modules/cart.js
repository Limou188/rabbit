import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { getNewCarGoods } from '@/api/cart'
import { mergeLocalCart } from '@/api/user'
import { findCartList, insertCart, deleteCart ,updateCart ,checkAllCart } from '@/api/cart'



export const useCartStore = defineStore('cart', {
  actions: {
    // 添加购物车
    insertCart(goods) {
      // console.log(goods.value.skuId);
      // console.log(this.list[0]._value.skuId);
      // const sameIndex = this.list.findIndex(item => item.skuId == goods.skuId)
      const sameIndex = this.list.findIndex(item => item.skuId === goods.skuId)
      // console.log(sameIndex);
      // 如果有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        // console.log(goods.value.count);
        // console.log(this.list[sameIndex]._value.count);
        // goods.value.count = this.list[sameIndex].count + goods.count
        goods.count = this.list[sameIndex].count + goods.count// 累加数量
        this.list.splice(sameIndex, 1)// 删除下标为sameIndex的商品
      }
      this.list.unshift(goods)// 将goods插入到数组的开头
      // console.log(this.list);
    },
    // 添加购物车，判断是否登入
    setCart(res) {
      const goods = res.value
      const userStore = useUserStore()// 获取其他store,需要在方法里面使用
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {// 如果有token代表已登入
          // 已登入TODO
          // 先发送post请求,讲商品加入购物车列表
          insertCart(goods).then(() => {//goods为改商品的完整数据
            return findCartList()// 发送get请求，获得当前购物车列表
          }).then((data) => {// data为用户的购物车列表
            this.setCartList(data.result)// 将本地购物车列表设置为登入后用户的购物车列表
            resolve()
          })
        } else {
          // 未登入
          this.insertCart(goods)
          resolve()
        }
      })
    },
    // 修改购物车商品数量
    updateCart(goods) {
      // goods中字段有可能不完整，goods有信息才去修改
      // 首先根据传参skuId去商品列表中找到对应项（find找到updateGoods）
      // 然后遍历goods中的每一项，将对应项的值设置为传参goods的值,updateGoods.selected = goods.selected
      // 由于本方法是被遍历调用每次只要处理一个数据（将整个商品列表拆成单独的的项）,不会循环执行find，因为每次的goods是单个商品
      // 所以不需要考虑数组下标，find方法已经找到在所有商品中跟传参goods id 相同的商品
      const updateGoods = this.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        // console.log(key);
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          // updateGoods.selected = goods.selected
          updateGoods[key] = goods[key]
        }
      }
    },
    // 修改购物车商品数量，判断是否登入
    setUpdateCart(res) {
      // console.log(res);
      const userStore = useUserStore()
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          // 已登入
          updateCart(res).then(()=>{
            console.log('002');
            return findCartList()
          }).then(data => {
            console.log('001');
            this.setCartList(data.result)
            resolve()
          })
        } else {
          // 本地
          this.updateCart(res)
          resolve()
        }
      })
    },
    // 获取购物车列表
    findCartList() {
      return new Promise((resolve, reject) => {
        const userStore = useUserStore()
        if (userStore.profile.token) {
          // 已登入
          findCartList().then(data => {
            this.setCartList(data.result)
            resolve()
          })
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参是promise数组
          const promiseArr = this.list.map(item => {
            // 返回接口函数的调用
            return getNewCarGoods(item.skuId)
          })
          Promise.all(promiseArr).then(dataArr => {
            dataArr.forEach((data, i) => {
              this.updateCart({ skuId: this.list[i].skuId, ...data.result })
            })
            resolve()
          }).catch(err => {
            reject(err)
          })
        }
      })
    },
    // 删除购物车
    deleteCart(skuId) {
      const index = this.list.findIndex(item => item.id === skuId)
      this.list.splice(index, 1)
    },
    // 删除购物车商品，判断是否登入
    setDeleteCart(skuId) {
      const userStore = useUserStore()
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          // 已登入
          deleteCart([skuId]).then(() => {
            console.log('001');
            return findCartList()
          }).then((data) => {
            this.setCartList(data.result)
            resolve()
          })
        } else {
          this.deleteCart(skuId)
          console.log('002');
          resolve()
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart(isClear) {
      const userStore = useUserStore()
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          // 已登入
          // 得到需要删除的商品列表（失效、选中）的skuId集合
          if (isClear) {
            const ids = this.invalidList.map(item => item.skuId)
            deleteCart(ids).then(() => {
              return findCartList()
            }).then((data) => {
              this.setCartList(data.result)
              resolve()
            })
          } else {
            console.log('001');
            const ids = this.selectedList.map(item => item.skuId)
            deleteCart(ids).then(() => {
              return findCartList()
            }).then((data) => {
              this.setCartList(data.result)
              resolve()
            })
          }
        } else {
          // 本地
          // 判断是批量删除还是清空失效商品，进行遍历调用deleteCart函数
          console.log('002');
          this[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            this.deleteCart(item.skuId)
          })
          resolve()
        }
      })
    },
    // 有效商品的全选和反选
    checkAllCart(selected) {
      // console.log(selected);
      const userStore = useUserStore()
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          // 已登入
          const ids = this.validList.map(item => item.skuId)// 获取有效商品列表的skuId集合
          console.log(ids);
          checkAllCart({ selected,ids }).then(()=>{
            return findCartList()
          }).then(data => {
            console.log('001');
            this.setCartList(data.result)
          })
        } else {
          // 本地
          // 获取有效商品列表，遍历调用updateCart,将有效商品的selected值逐个更新（true或false）
          // console.log(this.validList);
          this.validList.forEach(item => {
            // console.log(item);
            this.updateCart({ skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 修改sku规格参数
    updateCartSku({ oldSkuId, newSku }) {
      const userStore = useUserStore()
      return new Promise((resolve, reject) => {
        if (userStore.profile.token) {
          // 已登入
          // 获取原先商品数量
          // 删除原先商品
          // 获取修改的skuId和原先商品数量，并加入购物车
          // 更新列表
          const oldGoods = this.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId]).then(() => {
            return insertCart({skuId:newSku.skuId,count:oldGoods.count})
          }).then(data => {
            console.log('001');
            return findCartList()
      }).then(data => {
        this.setCartList(data.result)
        resolve()
      })
        } else {
          // 本地
          // 当修改了sku的时候skuId需要修改，相当于把原来的信息移出，创建一条新的商品信息
          // 1.获取旧的商品信息
          const oldGoods = this.list.find(item => item.skuId === oldSkuId)
          // 2.删除就的商品
          this.deleteCart(oldSkuId)
          // 3.创建新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4.插入信息
          this.insertCart(newGoods)
        }
      })
    },
    // 设置购物车列表（登录）
    setCartList(newList) {
      this.list = newList
    },
    // 合并本地购物车
    async mergeLocalCart() {
      // 存储token后调用合并api接口函数，进行购物车合并
      const cartList = this.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并后清空本地购物车
      this.setCartList([])
    }
  },
  getters: {
    // 有效商品列表
    validList() {
      // console.log(state.list[0]._value)
      // return state.list.filter(item => item.stock > 0 && item.isEffective)
      return this.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal() {
      // 累加,p是上一次调用回调函数的返回值，c是当前数字中被操作值
      // 如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法
      return this.validList.reduce((p, c) => p + c.count, 0)
      // state.validList.reduce(function(p,c,index,array){
      //   return p + c.count
      // },0)
    },
    // 有效商品总价
    validAmount() {
      return this.validList.reduce((p, c) => p + c.nowPrice * c.count, 0)
    },
    // 无效商品列表
    invalidList() {
      return this.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList() {
      // console.log(this.validList);
      return this.validList.filter(item => item.selected)
    },
    // 选中商品件数
    selectedTotal() {
      return this.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount() {
      return this.selectedList.reduce((p, c) => p + (c.nowPrice * 100 * c.count), 0) / 100
    },
    // 是否全选
    isCheckAll() {
      return this.validList.length === this.selectedList.length && this.selectedList.length > 0
    }
  },
  state() {
    return {
      // 购物车列表
      list: []
    }
  },
  persist: {
    key: 'cart', //存储名称
    storage: localStorage, // 存储方式
    //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
    paths: ['list'],
  },
})