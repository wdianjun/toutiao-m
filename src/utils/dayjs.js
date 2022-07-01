import Vue from 'vue'

// 导入dayjs
import dayjs from 'dayjs' /* ES */

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 配置相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 全局使用
dayjs.locale('zh-cn')
// console.log(dayjs().format('DD/MM/YYYY'))

// 定义过滤器
// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
export default dayjs
