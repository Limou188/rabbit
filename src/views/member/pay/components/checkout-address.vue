<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, '') + showAddress.address }}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog()">编辑地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit()">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换收货地址 -->
  <XtxDialog title="编辑收货地址" v-model:visible="dialogVisible">
    <div 
      class="text item" 
      v-for="item of addressList" 
      :key="item.id"
      :class="{ active: selectedAddress && item.id === selectedAddress.id }" 
      @click="selectedAddress = item"
    >
      <ul>
        <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
        <li><span>联系方式：</span>{{ item.contact }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g, '') + item.address }}</li>
      </ul>
      <a href="javascript::" class="iconfont icon-close-new iconCss" @click="omitData(item)"></a>
    </div>
    <!-- 对话框内容 -->
    <!-- v-slot:footer + template -->
    <template v-slot:footer>
      <XtxButton @click="dialogVisible = false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confirmAddress()" type="primary">确定</XtxButton>
    </template>
  </XtxDialog>
  <!-- 地址编辑表单,添加和修改 -->
  <AddressEdit ref="addressEdit" @on-success="successHandler" address="" />
</template>

<script setup name="CheckoutAddress">
import { ref } from 'vue'
import XtxDialog from "@/components/library/xtx-dialog.vue"
import AddressEdit from './addres-edit.vue'
import { omitAddress, getAddress } from '@/api/order'
import Message from '@/components/library/Message'



const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const addressList = ref(props.list)
// 对话框显示与隐藏
const dialogVisible = ref(false)
// 打开对话框
const openDialog = () => {
  dialogVisible.value = true
  selectedAddress.value = null
}

//删除地址
const omitData = (addresData) => {
  console.log(addresData)
  omitAddress(addresData).then(data => {
    getAddress().then(data => {
      addressList.value = data.result
      Message({text:'删除成功',type:'success'})
    })
  }).catch(ree => {
    Message({text:'删除失败',type:'error'})
  })
}

// 确认地址
const confirmAddress = () => {
  dialogVisible.value = false
  showAddress.value = selectedAddress.value
  emit('change', showAddress.value?.id)
}

// 选中的地址
const selectedAddress = ref(null)
// 默认显示地址
const showAddress = ref(null)
// 显示的地址
if (props.list.length) {
  const defaultAddress = props.list.find(item => item.isDefault === 1)
  if (defaultAddress) {
    showAddress.value = defaultAddress
  } else {
    // eslint-disable-next-line vue/no-setup-props-destructure
    showAddress.value = props.list[0]
  }
}

// 添加和修改收货地址组件
const addressEdit = ref(null)
const openAddressEdit = (showAddress) => {
  if (addressEdit.value) {
    addressEdit.value.open(showAddress)
  }
}

// 接收成功添加或修改的地址对像
const successHandler = (formData) => {
  const editAddress = props.list.find(item => item.id === formData.id)
  if (editAddress) {
    // 修改
    for (const key in editAddress) {
      editAddress[key] = formData[key]
    }
  } else {
    // 添加
    const json = JSON.stringify(formData)// 拷贝一份数据，不然使用的是对象的引用，JSON.stringify 将对象转成 JSON 字符串
    // eslint-disable-next-line vue/no-mutating-props
    props.list.unshift(JSON.parse(json))// JSON.parse把字符串解析成对象
  }
}

// 默认通知一个地址Id给父组件
const emit = defineEmits(['change'])
emit('change', showAddress.value?.id)

</script>

<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;

      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }

      >ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.iconCss {
  position: absolute;
  right: 70px;
  font-size: 20px;
  color:rgb(142, 136, 136);
  &:hover {
    color:rgb(0, 0, 0);
  }
}
</style>