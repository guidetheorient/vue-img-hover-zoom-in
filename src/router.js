import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constRouter = [
  {
    path: '/',
    redirect: '/body-scroll'
  },
  {
    path: '/body-scroll',
    component: () => import('@/components/BodyScroll')
  },
  {
    path: '/element-scroll',
    component: () => import('@/components/ElementScroll')
  }
]

export default new Router({
  routes: constRouter
})
