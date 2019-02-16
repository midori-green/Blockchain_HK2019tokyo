import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: "/wallet"
    },
    {
      path: '/student/request',
      name: 'StudentRequest',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/StudentRequest/index.vue')
    },
    {
      path: '/student/request',
      name: 'StudentRequest',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/Test/index.vue'),
    },
    {
      path: '/university/sign',
      name: 'UniversitySign',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/UniversitySign/index.vue')
    },
    {
      path: '/university/signed',
      name: 'UniversitySigned',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/UniversitySigned/index.vue')
    },
    {
      path: '/company/request',
      name: 'CompanyRequest',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/CompanyRequest/index.vue')
    },
    {
      path: '/company/requested',
      name: 'CompanyRequested',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/CompanyRequested/index.vue')
    },
    {
      path: '/student/sign',
      name: 'StudentSign',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/StudentSign/index.vue')
    },
    {
      path: '/student/signed',
      name: 'StudentSigned',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/StudentSigned/index.vue')
    },
    {
      path: '/register',
      name: 'Register',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/Register/index.vue')
    },
    {
      path: '/wallet',
      name: 'Wallet',
      // lazy load
      component: () => import(/* webpackChunkName: "about" */ './components/Wallet/index.vue')
    }
  ]
})
