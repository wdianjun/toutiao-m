import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './styles/index.less'
// 加载注册 Vant 组件
import Vant from 'vant'
import 'vant/lib/index.css'
// 动态设置 REM 基准值
import 'amfe-flexible'
// 注册使用vant组件库
// 导入dayjs
import dayjs from '@/utils/dayjs'

Vue.use(Vant)
Vue.prototype.$dayjs = dayjs
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
