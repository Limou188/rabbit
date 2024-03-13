<template>
  <!-- 概要 -->
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img :src="portrait"/>
      </div>
      <h4>{{ userStore.profile.nickname }}</h4>
    </div>
    <div class="item">
      <a href="javascript:;">
        <span class="iconfont icon-hy"></span>
        <p>会员中心</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-aq"></span>
        <p>安全设置</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-dw"></span>
        <p>地址管理</p>
      </a>
    </div>
  </div>
</template>

<script setup name="HomeOverview">
import { useUserStore } from '@/stores/modules/user'
import { onMounted } from 'vue'
import { getUserInfo, updatePortrait } from '@/api/user'
import { ref } from 'vue'
import Message from '@/components/library/Message'



const portrait = ref('')
const uploadLimit = ref(0)
// 获取用户消息
onMounted(async () => {
  await getUserInfo().then(({result:{avatar}}) => {
    portrait.value = avatar
  })
})



const userStore = useUserStore()
// console.log(userStore.profile);
</script>

<style scoped lang="less">
.img {
  object-fit: cover;
}

.home-overview {
  height: 132px;
  background: url(../../../../assets/images/center-bg.png) no-repeat center / cover;
  display: flex;

  .user-meta {
    flex: 1;
    display: flex;
    align-items: center;

    .avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 60px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    h4 {
      padding-left: 26px;
      font-size: 18px;
      font-weight: normal;
      color: white;
    }
  }

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:first-child {
      border-right: 1px solid #f4f4f4;
    }

    a {
      color: white;
      font-size: 16px;
      text-align: center;

      .iconfont {
        font-size: 32px;
      }

      p {
        line-height: 32px;
      }
    }
  }
}
</style>