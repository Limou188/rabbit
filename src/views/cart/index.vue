<template>
  <appTopnav />
  <appHearder />
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox :modelValue="cartStore.isCheckAll" @change="checkAll">全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <!-- 购物车无商品页面 -->
            <tr v-if="cartStore.validList.length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr v-for="item of cartStore.validList" :key="item.skuId">
              <td>
                <!-- // 单选 -->
                <XtxCheckbox @change="$event => checkOne(item.skuId, $event)" :modelValue="item.selected" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku :attrs-text="item.attrsText" :skuId="item.skuId"
                      @change="$event => updateCartSku(item.skuId, $event)" />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price > item.nowPrice">
                  比加入时降价
                  <span class="red">&yen;{{ item.price - item.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <!-- $event是XtxNumbox组件传递过来的数据 -->
                <XtxNumbox :modelValue="item.count" :max="item.stock"
                  @change="$event => changeCount(item.skuId, $event)" />
              </td>
              <td class="tc">
                <p class="f16 red">&yen;{{ item.nowPrice * 100 * item.count / 100 }}</p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteCart(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="cartStore.invalidList.length > 0">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="item of cartStore.validList" :key="item.skuId">
              <td>
                <XtxCheckbox style="color:#eee;" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice * 100 * item.count / 100 }}</p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;" @click="deleteCart(item.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox :modelValue="cartStore.isCheckAll" @change="checkAll">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart()">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ cartStore.validTotal }} 件商品，已选择 {{ cartStore.selectedTotal }} 件，商品合计：
          <span class="red">¥{{ cartStore.selectedAmount }}</span>
          <XtxButton type="primary" @click="goCheckout()">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
  <appFooter />
</template>

<script setup name="XtxCartPage">
import { RouterLink,useRouter } from 'vue-router'
import GoodRelevant from '@/views/goods/components/GoodsRelevant.vue'
import { useCartStore } from '@/stores/modules/cart'
import CartNone from './components/cart-none.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import CartSku from './components/cart-sku.vue'
import { useUserStore } from '@/stores/modules/user'
import appTopnav from '@/components/app-topnav.vue'
import appHearder from '@/components/app-hearder.vue'
import appFooter from '@/components/app-footer.vue'



const cartStore = useCartStore()
// 单选
const checkOne = (skuId, selected) => {
  // console.log(skuId,selected,)
  cartStore.setUpdateCart({ skuId, selected })
}
// 全选
const checkAll = (selected) => {
  // console.log(selected);
  cartStore.checkAllCart(selected)
}
// console.log(cartStore.isCheckAll);
//  删除
const deleteCart = (skuId) => {
  console.log(skuId)
  Confirm({ text: '您确定从购物车删除该商品吗？' }).then(() => {
    cartStore.setDeleteCart(skuId).then(() => {
      Message({ type: 'success', text: '删除成功' })
    })
  }).catch(e => {
    // 取消
  })
}
// 批量删除
const batchDeleteCart = (isClear) => {
  Confirm({ text: `您确定从购物车删除${isClear ? '失效' : '选中'}的商品吗？` }).then(() => {
    cartStore.batchDeleteCart(isClear).then(() => {
      Message({ type: 'success', text: '删除成功' })
    })
  }).catch(e => {
    // 取消
  })
}
// 修改数量
const changeCount = (skuId, count) => {
  // console.log(skuId,count);
  cartStore.setUpdateCart({ skuId, count })
}
// 修改销售属性
const updateCartSku = (oldSkuId, newSku) => {
  // console.log(oldSkuId,newSku);
  cartStore.updateCartSku({ oldSkuId, newSku })
}
// 跳转结算页面
const router = useRouter()
const userStore = useUserStore()
const goCheckout = () => {
  // 判断是否选中有效商品
  // 判断是否已经登入，未登入的话弹窗提示
  // 最后进行跳转，需要做访问权限控制
  if(cartStore.selectedTotal === 0) return Message({ type: 'error', text: '请至少选择一件商品' })
  if(!userStore.profile.token){
    Confirm({text:'下单前需要登录，您是否去登录?'}).then(()=>{
      // 点击确定
      router.push('/login')
    }).catch(e => {})
  }else{
    router.push('/member/checkout')
  }
}
</script>

<style scoped lang="less">
.tc {
  text-align: center;

  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}

.red {
  color: @priceColor;
}

.green {
  color: @xtxColor
}

.f16 {
  font-size: 16px;
}

.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  >div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .xtx-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>