import Vue from 'vue'
import App from './App'
import store from 'store/store.js'
Vue.prototype.$store = store
import common from 'static/js/common.js'
Vue.prototype.$common = common
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
