import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import store from './store/auth'

// Vue.pototype.$http = Axios;
Vue.config.productionTip = false;

// const token = localStorage.getItem('token');
// if (token) {
//   Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
// }
Vue.prototype.$http = require('axios');
Vue.prototype.$mainUrl = 'http://188.166.212.218:3000/'

new Vue({
  vuetify,
  VueAxios, 
  Axios,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
