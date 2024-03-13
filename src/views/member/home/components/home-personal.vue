<template>
  <homeOverview />
  <div class="home-personal">
    <HomePanel title="用户信息" :lookAll="false" class="userAvatar">
      <div class="avatar">
        <span>头像:</span>
        <img :src="userInfo.avatar" @click="handlePreview" />
        <el-upload class="upload-demo" :http-request="updateUserPortrait" accept=".jpg,.png,.gif,.jpeg"
          :show-file-list='false'>
          <el-button type="primary" class="elButton">更换头像</el-button>
        </el-upload>
      </div>
    </HomePanel>
    <div class="userInfo">
      <HomePanel title="修改个人信息" :lookAll="false">
      <ul>
        <li><span>昵称:</span><input type="text" v-model="userInfo.nickname" class="input" /></li>
        <li>
          <span>性别:</span>
            <a v-for="(item, index) of gender" :key="index">
              <label class="labelActive" :class="{ active: item.isShow }">{{ item.label }}
                <input type="checkbox" :value="item.label" v-model="selectedValue" @click="clickGender(index)" />
              </label>
            </a>
        </li>
        <li><span>生日:</span>
            <el-date-picker v-model="birthday" type="date" :placeholder="userInfo.birthday"
              style="width: 145px;" @change="changeDate" />
        </li>
        <li>
          <span>地址:</span><XtxCity 
                        :fullLocation="userInfo.fullLocation" 
                        :placeholder="userInfo.fullLocation"
                        @change="getFullLocation" />
        </li>
        <li><span>职业:</span><input type="text" v-model="userInfo.profession" class="input" /></li>
        <button @click="savePersonal">保存信息</button>
      </ul>
    </HomePanel>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="点击 预览" height="500px" />
  </el-dialog>
</template>

<script lang="js" setup>
import HomeOverview from './home-overview.vue'
import HomePanel from './home-panel.vue'
import { onMounted, ref } from 'vue'
import { getUserInfo, updatePortrait, updateUserInfo, getVerifyCode } from '@/api/user.js'
import Message from '@/components/library/Message'
import XtxCity from '@/components/library/xtx-city.vue'



// 获取用户信息
let userInfo = ref({})
const getInfo = () => {
  getUserInfo().then(({ result }) => {
    userInfo.value = result
    // console.log(result);
  },
    err => { }
  )
}
onMounted(() => {
  // let mobile = ''
  // let type = 'register'
  // getVerifyCode(mobile,type).then(res=>{
  //   console.log(res);
  // })
  // 渲染完毕获取信息
  getInfo()
})
// 预览图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 头像预览
const handlePreview = (uploadFile) => {
  dialogImageUrl.value = userInfo.value.avatar
  dialogVisible.value = true
}

// 更换头像
const updateUserPortrait = ({ file }) => {
  console.log(file);
  const formData = new FormData()
  formData.append('file', file)
  updatePortrait(formData).then(res => {
    Message({ text: '头像修改成功', type: 'success' })
    getInfo()
  })
}

const gender = [
  { label: '男', value: '1', isShow: false },
  { label: '女', value: '0', isShow: false }
]

// 收集用户更换的新数据
// 性别
const selectedValue = ref([])
const clickGender = (index) => {
  if (index === 1) {
    gender[1].isShow = true
    gender[0].isShow = false
    userInfo.value.gender = '女'
  } else {
    gender[0].isShow = true
    gender[1].isShow = false
    userInfo.value.gender = '男'
  }
}
// 地址
const getFullLocation = (changeResult) => {
  userInfo.value.provinceCode = changeResult.provinceCode
  userInfo.value.cityCode = changeResult.cityCode
  userInfo.value.countyCode = changeResult.countyCode
  userInfo.value.fullLocation = changeResult.fullLocation
}
// 生日
let birthday = ref('')
let year = ''
let month = ''
let day = ''
const changeDate = () => {
  year = birthday.value.getFullYear()
  let m = birthday.value.getMonth() + 1
  if (m < 10) {
    month = '0' + m
  }else{
    month = m
  }
  let d = birthday.value.getDate()
  if (d < 10) {
    day = '0' + d
  }else{
    day = d
  }
  userInfo.value.birthday = year + '-' + month + '-' + day
}

// 提交更改
const savePersonal = () => {
  // console.log(userInfo.value);
  updateUserInfo(userInfo.value).then(res=>{
    Message({text:'修改成功',type:'success'})
  })
}
</script>

<style lang="less" scoped>
.home-personal {
  .userAvatar {
    height: 250px;
    width: 100%;
    .elButton {
        color: white;
        background-color: #37b69a;
        border: 1px solid #37b69a;

        &:hover {
          background-color: #4ac8ad;
        }
      }
    .avatar {
      height: 150px;
      width: 100%;
      text-align: center;

      span {
        line-height: 110px;
        position: absolute;
        left: 280px;
        font-size: 20px;
      }

      .upload-demo {
        line-height: 110px;
        display: inline-block;
        position: absolute;
        right: 50px;
      }
    }
  }

  .userInfo{
    ul {
      color: rgb(115, 110, 110);
    li {
      width: 100%;
      margin-top: 30px;
      span{
        display: inline-block;
        position: relative;
        left: -30px;
        font-size: 18px;
        // justify-content:baseline;
      }
      .input {
        padding-left: 10px;
        display: inline-block;
        right: 50px;
        width: 150px;
        height: 30px;
        border: 1px solid #cdd5d3;
        border-radius: 5px;
      }

    }
    .labelActive {
      margin-left: 32px;
      color: #000000;
      font-size: 16px;
    &:hover {
      color: #27BA9B;
    }
  }

  .active {
    color: #27BA9B;
  }
  }

  button {
    position: relative;
    left: 50% - 20px;
    font-size: 14px;
    margin-top: 30px;
    width: 80px;
    height: 33px;
    border-radius: 5px;
    color: white;
    background-color: #37b69a;
    border: 1px solid #37b69a;

    &:hover {
      background-color: #4ac8ad;
    }
  }
  }
}
</style>