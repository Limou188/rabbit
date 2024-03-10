import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  actions: {
    // 修改用户信息，payload就是用户信息对象
    setUser(payload) {
      this.profile = payload
    }
  },
  state() {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  persist: {
    key: 'user', //存储名称
    storage: localStorage, // 存储方式
    //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
    paths: ['profile',], 
  },
})
