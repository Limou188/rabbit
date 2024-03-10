<template>
  <appTopnav />
  <!-- <appHearder /> -->
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付结果</XtxBreadItem>
      </XtxBread>
      <!-- 支付结果 -->
      <div class="pay-result">
        <span v-if="$route.query.payResult" class="iconfont icon-queren2 green"></span>
        <span v-else class="iconfont icon-queren2 red"></span>
        <p class="tit">订单支付{{ $route.query.payResult ? '成功' : '失败' }}</p>
        <p class="tip" v-if="$route.query.payResult">我们将尽快为您发货,收货期间请保持手机通畅</p>
        <p class="tip" v-else>请扫描下方二维码完成支付</p>
        <!-- <p>支付方式:<span>支付宝支付</span></p> -->
        <img src="@/assets/images/wx.png" alt="微信扫码支付" height="170px" style="margin-right: 20px;">
        <img src="@/assets/images/zfb.png" alt="支付宝扫码支付" height="170px">
        <p class="ps" v-if="$route.query.payResult">支付金额:<span>￥{{ order.payMoney }}</span></p>
        <p class="ps" v-else>待支付金额:<span>￥{{ order.payMoney }}</span></p>
        <div class="btn">
          <XtxButton @click="$router.push('/')" type="gray" style="margin-right:20px">进入首页</XtxButton>
          <XtxButton @click="$router.push('/member/order')" type="primary">查看订单</XtxButton>
        </div>
        <p class="alert">
          <span class="iconfont icon-tip"></span>
          温馨提示：小兔鲜儿不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作，保护资产、谨慎操作。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup name="XtxPayResultPage">
import { findOrderDetail } from '@/api/order'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import appTopnav from '@/components/app-topnav.vue'



const order = ref(null)

const route = useRoute()

findOrderDetail(route.query.id).then(data => {
  order.value = data.result
})
</script>

<style scoped lang="less">
.pay-result {
  background: #fff;
  text-align: center;

  >.iconfont {
    font-size: 100px;
  }

  .green {
    color: #1dc779;
  }

  .red {
    color: @priceColor;
  }

  .tit {
    font-size: 24px;
  }

  .tip {
    color: #999;
  }

  p {
    line-height: 40px;
    font-size: 16px;
  }

  .ps {
    margin-top: 20px;
    font-size: 25px;
  }

  .btn {
    margin-top: 30px;
  }

  .alert {
    font-size: 12px;
    color: #999;
    margin-top: 50px;
  }
}
</style>