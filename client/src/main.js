
import Vue from 'vue'
import App from './App'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import vuetify from "./plugins/vuetify";
import 'vuetify/dist/vuetify.min.css'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.config.productionTip = false
Vue.use(DatetimePicker)
/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  vuetify,
  router
}).$mount('#app')
