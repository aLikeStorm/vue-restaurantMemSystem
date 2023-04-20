import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 重定向
  {path: '/', redirect:'login'},
  // 登录页面
  {path: '/login', name: 'login', component: () => import('../views/Login/index')},
  // 主页
  {path: '/homepage', name: 'homepage', component: () => import('../views/Homepage/index'), children: [
      // 人员管理
      {path: 'personManage', name: 'personManage', component: () => import('../components/personManage/index')},
      // 分类管理
      {path: 'classManage', name: 'classManage', component: () => import('../components/classManage/index')},
      // 菜品管理
      {path: 'dishManage', name: 'dishManage', component: () => import('../components/dishManage/index')},
      // 套餐管理
      {path: 'setMealManage', name: 'setMealManage', component: () => import('../components/setMealManage/index')},
      // 订单管理
      {path: 'orderManage', name: 'orderManage', component: () => import('../components/orderManage/index')},
  ]}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
