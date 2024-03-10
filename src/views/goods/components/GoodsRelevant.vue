<template>
  <!-- 商品推荐组件 -->
  <div class='goods-relevant'>
    <div class="header">
      <i class="icon" />
      <span class="title">{{ goodsId ? '同类商品推荐' : '猜你喜欢' }}</span>
    </div>
    <!-- 此处使用改造后的<xtx-carousel></xtx-carousel> -->
    <XtxCarousel :sliders="sliders" auto-play style="height: 380;" />
  </div>
</template>

<script setup name="GoodsRelevant">
import { findRelGoods } from '@/api/goods'
import { ref } from 'vue'

const props = defineProps({
  goodsId: {
    type: String,
    default: undefined
  }
})

// 需要得到的数据
const useRelGoodsData = (id) => {
  const sliders = ref([])
  findRelGoods(id).then(data => {
    // 每页四条
    const size = 4
    // Math.ceil返回大于一个数的最小整数，即一个数向上取整后的值。
    const total = Math.ceil(data.result.length / size)// 16 / 4 = 4
    for (let i = 0; i < total; i++) {
      // slice()方法返回一个索引和另一个索引之间的字符串
      sliders.value.push(data.result.slice(i * size, (i + 1) * size))
    }
  })
  // console.log(sliders.value);
  return sliders
}

// 初始化调用
const sliders = useRelGoodsData(props.goodsId)
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;

  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;

    .title {
      font-size: 20px;
      padding-left: 10px;
    }

    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);

      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
}

:deep(.xtx-carousel) {
  height: 380px;

  .carousel {
    &-indicator {
      bottom: 30px;

      span {
        &.active {
          background: @xtxColor;
        }
      }
    }

    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0, 0, 0, 0);
      color: #ddd;

      i {
        font-size: 30px;
      }
    }
  }
}
</style>