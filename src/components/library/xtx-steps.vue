<template>
  <div class="xtx-steps">
    <div class="xtx-steps-item" v-for="i in 5" :key="i" :class="active === i ? 'active' : ''">
      <div class="step"><span>{{ i }}</span></div>
    </div>
  </div>
  <div class="xtx-slot">
    <slot></slot>
  </div>
</template>

<script lang="jsx">
import { getCurrentInstance } from 'vue'
import XtxStepsItem from './xtx-steps-item.vue'


export default {
  name: 'XtxSteps',
  props: {
    active: {
      type: Number,
      default: 2
    }
  },
  render() {
    // const { ctx } = getCurrentInstance()
    const items = this.$slots.default()
    console.log(items);
    const dynamicItems = []
    items.forEach(item => {
      if (item.type.name === 'XtxStepsItem') {
        dynamicItems.push(item)
      } else {
        item.children.forEach(c => {
          dynamicItems.push(c)
        })
      }
    })
    const itemsJsx = dynamicItems.map((item, i) => {
      // active: i + 1 === ctx.active
      return <div class="xtx-steps-item">
        <div class="step"><span>{i + 1}</span></div>
        <div class="title">{item.props.title}</div>
        <div class="desc">{item.props.desc}</div>
      </div>
    })
    return <div class="xtx-steps">{itemsJsx}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-slot {
  display: flex;
  text-align: center;
}

.xtx-steps {
  display: flex;
  text-align: center;

  &-item {
    flex: 1;

    &:first-child {
      .step {
        &::before {
          display: none;
        }
      }
    }

    &:last-child {
      .step {
        &::after {
          display: none;
        }
      }
    }

    &.active {
      .step {
        >span {
          border-color: @xtxColor;
          background: @xtxColor;
          color: #fff
        }

        &::before,
        &::after {
          background: @xtxColor;
        }
      }

      .title {
        color: @xtxColor;
      }
    }

    .step {
      position: relative;

      >span {
        width: 48px;
        height: 48px;
        font-size: 28px;
        border: 2px solid #e4e4e4;
        background: #fff;
        border-radius: 50%;
        line-height: 44px;
        color: #ccc;
        display: inline-block;
        position: relative;
        z-index: 1;
      }

      &::after,
      &::before {
        content: "";
        position: absolute;
        top: 23px;
        width: 50%;
        height: 2px;
        background: #e4e4e4;
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }

    .title {
      color: #999;
      padding-top: 12px;
    }

    .desc {
      font-size: 12px;
      color: #999;
      padding-top: 6px;
    }

  }
}
</style>