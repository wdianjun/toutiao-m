import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 一级路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  // 一级路由
  {
    path: '/',
    // name: 'layout',
    redirect: '/home',
    component: () => import('@/views/layout'),
    children: [
      {
        path: 'home', // 默认子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }]
  },
  // 一级路由
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  // 一级路由
  {
    // 使用params传
    path: '/article/:articleId',
    // 使用query传
    // path: '/article',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  // 一级路由
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
