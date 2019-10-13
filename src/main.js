// src/main.js

import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import Axios from 'axios'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$http = Axios// 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等

import Login from './components/Login'
import TodoList from './components/TodoList'

const router =  new VueRouter({
  mode: 'history', // 开启HTML5的history模式，可以让地址栏的url长得跟正常页面跳转的url一样。（不过还需要后端配合，讲Koa的时候会说）
  base: __dirname,
  routes: [
    {
      path: '/',  // 默认首页打开是登录页
      component: Login
    },
    {
      path: '/todolist',
      component: TodoList
    },
    {
      path: '*',
      redirect: '/' // 输入其他不存在的地址自动跳回首页
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if(to.path == '/') { // 如果是跳转到登录页面的
    if(token != 'null' && token != null ) {
      next('/todolist') // 如果有token便跳转到登录页
    }
    next();
  }else {
    if(token != 'null' && token != null) {
      // 全局设定header的token验证
      Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token
      next() // 跳转正常
    }else {
      next('/') // 跳转登录页
    }
  }
})

const app = new Vue({
  router: router, // 启用router
  render: h => h(App)
}).$mount('#app') //挂载到id为app的元素上
