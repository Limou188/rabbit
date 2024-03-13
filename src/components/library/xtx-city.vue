<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog();open()" :class="{ active }">
      <span class="placeholder" v-if="!changeResult.fullLocation.length && !props.fullLocation.length">{{ props.placeholder }}</span>
      <span class="value" v-else>{{ props.fullLocation }}</span>
      <!-- <span class="value" v-if="changeResult.fullLocation.length">{{ changeResult.fullLocation }}</span> -->
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="active">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <!-- 点击省、市，展示市列表和县列表 -->
        <span class="ellipsis" v-for="item of currList" :key="item.code" @click="changeItem(item)">{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script setup name="XtxCity">
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios';

const props = defineProps({
  fullLocation:{
    type: String,
    default:''
  },
  placeholder:{
    type: String,
    default:'请选择配送地址'
  }
})

// 初始化地址数据
const changeResult = reactive({
  provinceCode: '',// 省id
  provinceName: '',// 省名字
  cityCode: '',// 市id
  cityName: '',// 市名字
  countyCode: '',// 县id
  countyName: '',// 县名字
  fullLocation: '',// 完整地址
})

// 控制展开收起，默认收起
const active = ref(false)
const openDislog = () => {
  active.value = true
  visible.value = true
}
const closeDialog = () => {
  active.value = false
  visible.value = false
}
// 切换展开收起
const toggleDialog = () => {
  if (active.value){
    closeDialog()
  }else {
    openDislog()
  }
}
// 点击其他位置隐藏,onClickOutside是vueuse的封装直接引入使用，target为要监听的元素区域
const target = ref(null)
onClickOutside(target,()=>{
  closeDialog()
})

// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 封装成promise,可能会有异常操作,promise是异步操作，异步操作不能直接return接收执行结果，只能通过回调来接收
  // resolve成功之后调用的回调函数，reject执行失败调用的回调函数
  return new Promise((resolve,reject)=>{
    // 判断是否有缓存
    if(window.cityData){// 判断window身上的cityData是否有值
      // 有缓存
      resolve(window.cityData)
    }else{
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res=>{
        window.cityData = res.data// 将请求结果赋值给window，这样可以在全局使用window。cityData
        resolve(window.cityData)
      })
    }
  })
}

// 获取城市数据，显示当前地方列表
// 显示和隐藏函数
const loading = ref(false)
const cityData = ref([])
const visible = ref(false)
const open = () => {
  visible.value = true
  loading.value = true
  // 获取数据
  getCityData().then(data => {
    cityData.value = data
    loading.value = false
  })
  // 执行完后清空选择结果,for循环遍历，key为下标，将数组中的值挨个赋值为空
  for(const key in changeResult){
    changeResult[key] = ''
  }
}

// 定义计算属性
const currList = computed(()=>{
  //省份
  let currList = cityData.value
  // 城市
  if(changeResult.provinceCode){
    currList = currList.find(p => p.code === changeResult.provinceCode).areaList
  }
  // 地区
  if(changeResult.cityCode){
    currList = currList.find(c => c.code === changeResult.cityCode).areaList
  }
  return currList
})
// 自定义事件，子传父
const emit = defineEmits(['change'])

const changeItem = (item) => {
  // 省份
  if(item.level === 0){// level为省市县对应的层级id，0为省，1为市，2为县
    changeResult.provinceCode = item.code
    changeResult.provinceName = item.name
  }
  // 市
  if(item.level === 1){
    changeResult.cityCode = item.code
    changeResult.cityName = item.name
  }
  // 县
  if(item.level === 2){// 当点击完县地址后将完整地址数据传递给父组件，并关闭城市列表
    changeResult.countyCode = item.code
    changeResult.countyName = item.name
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
    closeDialog()// 关闭城市列表
    emit('change',changeResult)// 触发自定义事件，将数据发送给父组件
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;  
  .select {
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    margin-left: 5px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 6px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/xyzw.gif) no-repeat center;
    }
  }
}
</style>