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
  {path: '/homepage', component: () => import('../views/Homepage/index'), children: [
      // 重定向
      {path: '/', redirect:'personManage'},
      // 人员管理
      {path: 'personManage', name: 'personManage', component: () => import('../components/personManage/index')},
      // 餐饮店管理
      {path: 'restManage', name: 'restManage', component: () => import('../components/restManage/index')},
      // 菜品管理
      {path: 'dishManage', name: 'dishManage', component: () => import('../components/dishManage/index')},
      // 优惠卷管理
      {path: 'couponManage', name: 'couponManage', component: () => import('../components/couponManage/index')},
      // 订单管理
      {path: 'orderManage', name: 'orderManage', component: () => import('../components/orderManage/index')},
      {path: 'commentManage', name: 'commentManage', component: () => import('../components/commentManage/index')},
  ]}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//全局路由
router.beforeEach((to, from, next) => {
    if (to.path !== '/login') {

        const userInfo = localStorage.getItem('authorization')
        if (userInfo) {
            next()
        } else {
            next('/login')
        }

    } else {
        next()
    }
})

export default router
