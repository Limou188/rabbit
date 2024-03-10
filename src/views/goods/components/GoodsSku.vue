<template>
  <div class="goods-sku">
    <dl v-for="item of goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val of item.values.slice(0, 6)" :key="val.name">
          <img :class="{ selected: val.selected }" @click="clickSpecs(item, val);" v-if="val.picture" :src="val.picture"
            :title="val.name">
          <!-- <img :class="{ selected: val.disabled }" @click="clickSpecs(item, val);" v-else :src="val.picture"
            :title="val.name"> -->
          <!-- val.picture<span :class="{ selected: val.selected }" @click="clickSpecs(item, val);" v-if="val.inventory" >{{ val.name }}</span> -->
          <span :class="{ selected: val.selected }" @click="clickSpecs(item, val);" v-else>{{ val.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script setup name="GoodsSku">
import getPowerSet from '../../../vender/PowerSet'

const props = defineProps({
  goods: {
    type: Object,
    default: () => ({
      specs: [],
      skus: []
    })
  },
  skuId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['change'])
const clickSpecs = (item, val) => {
  // 如果是禁用状态不作为
  if (val.disabled) return false
  // 1. 选中与取消选中逻辑
  if (val.selected) {
    val.selected = false
  } else {
    item.values.find(bv => { bv.selected = false })
    val.selected = true
  }
  // 点击的时候更新禁用状态
  updateDisabledStatus(props.goods.specs, pathMap)
  // 触发change事件将sku数据传递出去
  const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
  if (selectedArr.length === props.goods.specs.length) {
    const skuIds = pathMap[selectedArr.join(spliter)]
    const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
    // 传递
    emit('change', {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs.reduce((p, n) => `${p} ${n.name}:${n.valueName}`, '').replace(' ', '')
    })
  } else {
    emit('change', {})
  }
}
const spliter = '★'
// 根据skus数据得到路径字典对象，第三方算法库
const getPathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory) {// 如果传参中有inventory，（仓库中有库存）则代表可以被选中
      // 得到sku属性值数组
      const specs = sku.specs.map(spec => spec.valueName)
      // 得到sku属性值数组的子集
      const powerSet = getPowerSet(specs)
      // 设置路径字典对象
      powerSet.forEach(set => {
        const key = set.join(spliter)
        if (pathMap[key]) {
          // 已经有key往数组中追加
          pathMap[key].push(sku.id)
        } else {
          // 没有key设置一个数组
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach(spec => {
    const selectedVal = spec.values.find(val => val.selected)// val.selected被选中的那个属性
    selectedArr.push(selectedVal ? selectedVal.name : undefined)
  })
  return selectedArr
}

// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {// pathMap是路径字典
  specs.forEach((spec, i) => {// spec是数组中的每一项，i是数组的下标
    const selectedArr = getSelectedArr(specs)
    spec.values.forEach(val => {
      // 已经被选中的按钮不再判断
      if (val.name === selectedArr[i]) return false
      // 未选中的替换对应的值
      selectedArr[i] = val.name
      // 过滤无效值得到key
      const key = selectedArr.filter(v => v).join(spliter)// 
      val.disabled = !pathMap[key]
    })
  })
}

// 初始化选中状态
// goods包含了该商品的skus路径字典（每种规格组合结果的集合）以及所有specs规格属性（颜色、尺寸）
const initSelectedStatus = (goods, skuId) => {
  // 在路径字典中找到跟传参skuId相同的那一项,商品的规格属性组合sku
  const sku = goods.skus.find(sku => sku.id === skuId)
  // 如果sku存在，则代表这件商品有初始规格属性，在购物车页面调用的该方法
  if (sku) {
    goods.specs.forEach((spec, i) => {// spec是数组中的每一项，i是数组的下标
      // sku.specs[i]颜色或尺寸...，.valueName对应的值，蓝色、红色、、、
      const value = sku.specs[i].valueName
      // spec[颜色、尺寸],
      spec.values.forEach(val => {
        // 找到对应规格属性，并把它的selected设置为true或false
        val.selected = val.name === value// true,false
        // 首先，通过 find 方法从商品对象的 skus 数组中查找与传入 skuId 相匹配的 SKU。
        // 如果找到了对应的 SKU，则遍历商品对象的 specs 数组，specs例如颜色、尺寸...
        // 对于每个规格属性类别，获取当前 SKU 中对应规格属性的实际值，即 value = sku.specs[i].valueName。
        // 再次遍历当前规格属性类别的所有可选项 (spec.values)，将每个选项的 selected 属性设置为 true 或 false，
        // 依据是其 name 属性是否等于之前找到的实际值。
      })
    })
  }
}

// 根据传入的skuId默认选中规格按钮
initSelectedStatus(props.goods, props.skuId)
const pathMap = getPathMap(props.goods.skus)
// 组件初始化的时候更新禁用状态
updateDisabledStatus(props.goods.specs, pathMap)

</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  margin-top: 5px;
  cursor: pointer;

  &.selected {
    border-color: @xtxColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      >img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }

      >span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>