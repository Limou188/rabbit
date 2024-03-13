<template> 
  <!-- <LoginHeader>返回首页</LoginHeader> -->
  <AppTopnav class="topCss"/>
  <AppHearder />
  <section class="login-section">
    <div class="wrapper" >
      <nav>
        <a v-if="activeName !== 'register'" href="javascript:;" @click="activeName = 'account'" :class="{ active: activeName === 'account' }">账户登录</a>
        <a v-if="activeName !== 'register'" href="javascript:;" @click="activeName = 'qrcode'" :class="{ active: activeName === 'qrcode' }">扫码登录</a>
        <a v-if="activeName === 'register'" href="javascript:;"  :class="{ active: activeName === 'register' }">注册账号</a>
        <a v-if="activeName === 'register'" @click="activeName = 'account'">返回</a>
      </nav>
      <!-- 账号密码 -->
      <LoginForm v-if="activeName === 'account'" @register="register" ></LoginForm>
      <!-- 二维码 -->
      <div v-if="activeName === 'qrcode'" class="qrcode-box">
        <img src="@/assets/images/QR.jpg" height="200px" alt="李某">
        <p>打开<a href="javascript:;">原神App</a>扫码登入</p>
      </div>
      <!-- 注册账号 -->
      <div class="register" v-if="activeName === 'register'">
        <ul>
          <li><span>账号：</span><input type="text" placeholder="请输入账号" v-model="registerInfo.account"/></li>
          <li><span>密码：</span><input type="password" placeholder="请输入密码" v-model="registerInfo.password" /></li>
          <li><span>电话：</span><input type="text" placeholder="请输入手机号码" v-model="registerInfo.mobile"/></li>
          <li><span>验证码:</span><input type="text" placeholder="请输入短信验证码" v-model="registerInfo.code"/></li>
        </ul>
        <p @click="getCode">获取验证码</p>
        <a href="javascript:;" class="btn" @click="submit"><span>注册</span></a>
      </div>
    </div>
  </section>
  <LoginFooter />
</template>

<script setup name="Login">
import LoginFooter from './components/login-footer.vue'
import LoginForm from './components/login-form.vue'
import { ref, reactive, onMounted } from 'vue'
import AppHearder from '@/components/app-hearder.vue'
import AppTopnav from '@/components/app-topnav.vue'
import { userRegister, getVerifyCode } from '@/api/user.js'
import Message from '@/components/library/Message'
import { useRouter,useRoute } from 'vue-router'



const activeName = ref('account')
const register = () => {
  activeName.value = 'register'
}
// 判断是点击登入还是注册
const route = useRoute()
onMounted(()=>{
  if(route.params.id === '1'){
    activeName.value = 'register'
  }
})

// 用户信息
const registerInfo = reactive({
  account:'',
  password:'',
  mobile:'',
  code:'',
})
// 获取验证码
const getCode = () => {
  let type = activeName.value
  let mobile = registerInfo.mobile
  getVerifyCode(mobile,type).then(res => {
    Message({text:'验证码发送成功',type:'success'})
  })
}

const router = useRouter()
// 提交注册
const submit = () => {
  userRegister(registerInfo).then(res => {
    Message({text:'注册成功',type:'success'})
    router.push({path:'/login'})
  })
}
</script>

<style lang="less" scoped>
.register{
  transition: all 0.3s;
  height: 100%;
  width: 100%;
  text-align: center;
  ul{
    // margin-top: 30px;
    span{
      font-size: 16px;
    }
    li{
      margin: 15px;
      height: 40px;
      input{
        margin-left: 10px;
        height: 30px;
        border-radius: 3px;
        border: 1px solid #ccc;
        padding-left: 10px;
      }
    }
  }
  p{
    position:relative;
    left: 130px;
    margin: 5px;
    top: -10px;
    width: 100px;
    height: 30px;
    background: #d6d6d6;
    padding: 5px;
    border-radius: 2px;
    &:hover{
      background: #eeeeee;
      color: #575656;
    }
  }
  .btn{
    position: absolute;
    height: 40px;
    width: 300px;
    background-color: #27BA9B;
    left: 40px;
    &:hover{
      background-color: #4ac8ad
    }
    span{
      color: white;
      line-height: 40px;
    }
  }
}
// .headerCss {
//   // background: url(../../assets/images/200.png) no-repeat 0px -53px / cover;
//   // height: 110px;
// }
.login-section {
  // background: url(../../assets/images/200.png) no-repeat 0px -163px / cover;
  background: url(../../assets/images/200.png) no-repeat center / cover;
  height: 500px;
  position: relative;

  .wrapper {
    width: 380px;
    background: #ffffff;
    min-height: 400px;
    position: absolute;
    left: 64%;
    top: 48px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);

    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;

        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }

        &.active {
          color: @xtxColor;
          font-weight: bold;
        }
      }
    }
  }
}

// 二维码容器
.qrcode-box {
  text-align: center;
  padding-top: 40px;

  p {
    margin-top: 20px;

    a {
      color: @xtxColor;
      font-size: 16px;
    }
  }
}
</style>