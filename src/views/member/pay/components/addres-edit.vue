<template>
  <XtxDialog class="xtx-dialog" :title="(formData.id ? '编辑' : '添加') + '收货地址'" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人:</div>
          <div class="field">
            <input class="input" placeholder="请输入收货人姓名" v-model="formData.receiver" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号:</div>
          <div class="field">
            <input class="input" placeholder="请输入手机号码" v-model="formData.contact" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">所在地区:</div>
          <div class="field">
            <XtxCity class="xtx-city" placeholder="请选择所在地区" :fullLocation="formData.fullLocation" @change="changeCty" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址:</div>
          <div class="field">
            <input class="input" placeholder="请输入详细地址" v-model="formData.address" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码:</div>
          <div class="field">
            <input class="input" placeholder="请输入邮政编码" v-model="formData.postalCode" />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签:</div>
          <div class="field">
            <input class="input" placeholder="请输入地址标签,逗号分离" v-model="formData.addressTags" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px;" @click="dialogVisible = false">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确定</XtxButton>
    </template>
  </XtxDialog>
</template>

<script  name="AddressEdit" setup>
import { addAddress, editAddress } from "@/api/order"
import Message from "@/components/library/Message"
import { ref, reactive } from "vue"



const dialogVisible = ref(false)
// 打开对话框函数
const open = (address) => {
  // 先填充数据-修改
  if (address) {
    console.log('001');
    for (const key in formData) {
      formData[key] = address[key]
    }
  }
  if (!address) {
    console.log('002');
    // 先清空数据-添加
    for (const key in formData) {
      if (key !== 'isDefault') {
        formData[key] = ''
      }
    }
  }
  dialogVisible.value = true
}

// 表单数据
const formData = reactive({
  id: '',
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  fullLocation: '',
  address: '',
  postalCode: '',
  addressTags: '',
  isDefault: 0
})

// 选择地区
const changeCty = (data) => {
  formData.provinceCode = data.provinceCode
  formData.cityCode = data.cityCode
  formData.countyCode = data.countyCode
  formData.fullLocation = data.fullLocation
}

const emit = defineEmits(['on-success'])
// 提交操作
const submit = () => {
  if (formData.id) {
    console.log(formData);
    editAddress(formData).then(data => {
      // 修改地址成功
      Message({ text: '修改地址成功', type: 'success' })
      dialogVisible.value = false
      emit('on-success', formData)
    })
  } else {
    console.log(formData);
    addAddress(formData).then(data => {
      // 添加地址成功
      Message({ text: '添加成功', type: 'success' })
      formData.id = data.result.id
      dialogVisible.value = false
      emit('on-success', formData)
    })
  }
}

// 暴露方法
defineExpose({
  open,
})

</script>

<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;

    .body {
      font-size: 14px;
    }
  }
}

.xtx-form {
  padding: 0;

  input {
    outline: none;

    &::placeholder {
      color: #ccc;
    }
  }
}

.xtx-city {
  width: 320px;

  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;

    .placeholder {
      color: #ccc;
    }

    i {
      color: #ccc;
      font-size: 18px;
    }

    .value {
      font-size: 14px;
    }
  }

  :deep(.option) {
    top: 49px;
  }
}

// 表单
.xtx-form {
  padding: 50px 0;

  &-item {
    display: flex;
    align-items: center;
    width: 700px;
    margin: 0 auto;
    padding-bottom: 25px;

    .label {
      width: 180px;
      padding-right: 10px;
      text-align: right;
      color: #999;

      ~.field {
        margin-left: 0;
      }
    }

    .field {
      width: 320px;
      height: 50px;
      position: relative;
      margin-left: 190px;

      .icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #999;

        ~.input {
          padding-left: 40px;
        }
      }

      .input {
        border: 1px solid #e4e4e4;
        width: 320px;
        height: 50px;
        line-height: 50px;
        padding: 0 10px;

        &.err {
          border-color: @priceColor;
        }

        &:focus,
        &:active {
          border-color: @xtxColor;
        }
      }
    }

    .error {
      width: 180px;
      padding-left: 10px;
      color: @priceColor;
    }
  }

  .submit {
    width: 320px;
    height: 50px;
    border-radius: 4px;
    background: @xtxColor;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>