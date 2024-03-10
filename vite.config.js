import { fileURLToPath, URL } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: `
        @import "./src/assets/styles/variables.less";
        @import "./src/assets/styles/mixins.less";
        `
      }
    }
  },
  // 这段代码用于将图片文件打包为base64格式的URL，
  // 并设置打包后的文件大小限制为10KB以下。当图片文件大小小于等于10KB时，
  // 会被打包为base64格式的URL直接嵌入到代码中，
  // 而大于10KB的图片文件则会被使用url-loader默认的文件输出方式进行打包。
  chainWebpack:config => {
    config.module
    .rule('images')
    .use('url-loader')
    .loader('url-loader')
    .tap(options => Object.assign(options,{limit: 10240}))
  },
  // jsx配置
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: " import { h } from 'vue'; "
  },
  // plugins: [
  //   vueJsx({
  //     // options are passed on to @vue/babel-plugin-jsx
  //   }),
  // ],
})