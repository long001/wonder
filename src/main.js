// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/css/reset.scss'

import Vue from 'vue'
import App from './App'
import './assets/js/dmAux'
import dm from './assets/js/dm'
import watch from './assets/js/watch'

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  data() {
    const root = this.$root

    return {
      ...dm.rootData.call(root)
    }
  },
  methods: {
    ...dm.rootMethods,
  },
  watch: {
    ...watch,
  },
  components: { App },
  template: '<App/>',
  mounted() {
    const root = this.$root

    root.init()
  }
})
