import Vue from 'vue'
import Router from 'vue-router'
import BikeRent from "../components/BikeRent";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BikeRend',
      component: BikeRent
    }
  ]
})
