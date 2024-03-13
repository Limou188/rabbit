<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i>使用账号登入
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i>使用短信登入
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="mySchema" autocomplete="off" v-slot="{ errors }">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{ error: errors.account }" v-model="form.account" name="account" type="text"
              placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{ error: errors.password }" v-model="form.password" name="password" type="password"
              placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{ error: errors.mobile }" v-model="form.mobile" name="mobile" type="text"
              placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{ error: errors.code }" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send">
              {{ time === 0 ? '发送验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- <Field as="xtx-checkbox" name="isAgree" :modelValue="1" @change="changeAgree" /> -->
          <xtx-checkbox :modelValue="form.isAgree" @change="changeAgree" ></xtx-checkbox>
          <span>我已同意</span>
          <a href="javascript:;">《用户协议》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="submit()">登入</a>
    </Form>
    <div class="action">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;" @click="clickRegister">免费注册</a>
        <img src="../../../assets/images/QQ.jpg">
      </div>
    </div>
  </div>
</template>

<script setup name="LoginForm">
import { reactive, ref, watch, onUnmounted } from 'vue'
import veeSchema from '@/utils/vee-validate-schema.js'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userMobileLoginMsg, userMobileLogin } from '@/api/user'
import Message from '@/components/library/Message'// 当使用Message时会将xtx-message挂载到当前页面的body上
import { userAccountLogin } from '@/api/user'
import { useUserStore } from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/modules/cart'


// 把input改成 Field 组件，默认解析成input
// Field 添加name属性，作用是指定使用schema中哪个校验规则
// Form 添加 v-slot="{errors}" 使用作用域插槽暴露 errors 错误对象
// 通过 errors['校验规则名称'] 取出错误信息，有则显示，无即隐藏
// Field 的 as 属性可以指定为其他标签，也可指定为组件。
// 但是组件需要支持 v-model 否则校验不会触发

// 点击注册
const emit = defineEmits(['register'])
const clickRegister = () => {
  emit('register')
}

// 是否短信登入
const isMsgLogin = ref(false)

//表单信息对象
const form = reactive({
  isAgree: false,
  account: null,
  password: null,
  mobile: null,
  code: null
})

// console.log(test);
// watch(form,()=>{
//   console.log(form.isAgree);
// })

// 校验规则对象
const mySchema = {
  account: veeSchema.account,
  password: veeSchema.password,
  mobile: veeSchema.mobile,
  code: veeSchema.code,
  isAgree: veeSchema.isAgree,
}
// 切换登入，还原数据和清除校验效果
const formCom = ref(null)
watch(isMsgLogin, () => {
  // 还原数据
  form.isAgree = false,
  form.account = null,
  form.password = null,
  form.mobile = null,
  form.code = null,
  // 补充校验结果清除，From组件提供resetForm()
  formCom.value.resetForm();

})
// 点击勾选/取消勾选用户协议
const changeAgree = (checked) => {
  form.isAgree = !checked
  // console.log(checked);
}

// pause 暂停 resume 开始
// useIntervalFn(回调函数，执行间隔，是否立即开启)
const time = ref(0)
const { pause, resume } = useIntervalFn(() => {
  time.value--
  if (time.value <= 0) {
    pause()
  }
}, 1000, { immediate: false })
// 组件卸载时暂停定时器
onUnmounted(() => {
  pause()
})
// 发送短信验证码
const send = async () => {
  const valid = mySchema.mobile(form.mobile)// 调用校验函数里的手机号校验
  if (valid === true) {// 校验结果为true
    // 通过
    if (time.value === 0) {
      // 没有倒计时才可以发送
      await userMobileLoginMsg(form.mobile)
      time.value = 60
      Message({ type: 'success', text: '发送成功' })
      resume()
    }
  } else {
    // 失败，使用vee的错误函数显示错误信息setFieldError(字段，错误信息)
    formCom.value.setFieldError('mobile', valid)
    Message({ type: 'error', text: '请输入正确的手机号' })
  }
}


// 使用pinia
const userStore = useUserStore()
// 使用Router
const router = useRouter()
// 使用Route
const route = useRoute()

const cartStore = useCartStore()

// 登入提交,调用vee-validate-schema内置的validate()整体表单校验
const submit = async () => {
  // 整体校验
  const valid = await formCom.value.validate()
  if (valid && form.isAgree) {
    // 发送请求
    let data = null
    try {
      // 账号登入
      if (!isMsgLogin.value && form.account && form.password) {
        data = await userAccountLogin(form)
        // console.log('账号登入');
      }
      else if (isMsgLogin.value && form.mobile && form.code) {
        // 1.短信登入
        // 2.实现发送短信验证码功能
        // 3.完成手机号短信验证码登入逻辑
        data = await userMobileLogin(form)
        // console.log('短信登入');
      } else {
        Message({ type: 'error', text: '请正确填写信息' })
        return
      }
    } catch (error) {
      Message({ type: 'error', text: error.response.data.message || '登入失败' })
    }
    // 成功
    // 1. 保存用户信息
    const { id, account, nickname, avater, token, moblie } = data.result
    userStore.setUser({ id, account, nickname, avater, token, moblie })
    // 合并购物车操作
    cartStore.mergeLocalCart().then(() => {
      // 提示
      Message({ type: 'success', text: '登入成功' })
      // 跳转
      router.push(route.query.redirectUrl || '/')
    })
  } else {
    Message({ type: 'warn', text: '请勾选用户协议' })
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    // text-align: justify;
    // height: 30px;
    // line-height: 30px;
    padding: 30px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      height: 30px;
      position: absolute;
      right: 30px;
    }

    .url {
      a {
        color: #999;
        margin-left: 10px;
        &:hover{
          color: @xtxColor;
        }
      }
    }
  }
}
</style>