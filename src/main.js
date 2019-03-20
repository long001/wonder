// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/css/reset.scss'
import '@/assets/js/com'
import './assets/js/dmAux'

import Vue from 'vue'
import dm from './assets/js/dm'
import ajax from './assets/js/ajax'
import router from './assets/js/router'
import player from './assets/js/player'
import lazyLoad from './assets/js/lazyLoad'
import watch from './assets/js/watch'
import computed from './assets/js/computed'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  data() {
    const root = this.$root

    return {
      ...dm.rootData.call(root),
      ...App.rootData.call(root),
    }
  },
  methods: {
    ...dm.rootMethods,
    ...ajax.rootMethods,
    ...lazyLoad.rootMethods,
    ...router.rootMethods,
    ...player.rootMethods,
    ...App.rootMethods,
  },
  watch: {
    ...watch,
  },
  computed: {
    ...computed,
  },
  components: { App },
  template: '<App/>',
  mounted() {
    const root = this.$root

    root.init()
  }
})
