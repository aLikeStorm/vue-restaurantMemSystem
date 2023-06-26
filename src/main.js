import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";

Vue.config.productionTip = false

//请求拦截器
axios.interceptors.request.use(function(config) {
  config.headers['authorization'] = localStorage.getItem('authorization');
  return config;
}, function(error) {
  //请求错误
  return Promise.reject(error)
});
Vue.use(ElementUI);
axios.defaults.baseURL = '/api'
Vue.prototype.$http = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
