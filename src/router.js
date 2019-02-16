import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/Home/index.vue'),
		},
		{
			path: '/test',
			name: 'Test',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/Test/index.vue'),
		},
		{
			path: '/license',
			name: 'License',
			// lazy load
			component: () => import(/* webpackChunkName: "about" */ './components/License/index.vue')
		}
	]
})
