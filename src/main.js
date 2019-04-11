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
    const vm = this.$root

    return {
      ...dm.rootData.call(vm),
      ...App.rootData.call(vm),
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
    const vm = this.$root

    vm.init()
  }
})

// {
//   const nodeStyle = document.createElement('style')
//   nodeStyle.innerHTML = new Array(vm.lenAni).fill().map((_, idx) => {
//     const dw = window.innerWidth
//     const dh = window.innerHeight
//     // const rand = vm.rand
//     const arr = [
//       'translateX',
//       'translateY',
//       'translateZ',
//       'rotateX',
//       'rotateY',
//       // 'rotate',
//     ]
//     const json = {
//       translateX: 'translateX(' + rand(-dw, dw) + 'px)',
//       translateY: 'translateY(' + rand(-dh, dh) + 'px)',
//       translateZ: 'translateZ(' + rand(-dw, 0) + 'px)',
//       rotateX: 'rotateX(' + rand(-180, 180) + 'deg)',
//       rotateY: 'rotateY(' + rand(-180, 180) + 'deg)',
//       // rotate: 'rotate(' + rand(-180, 180) + 'deg)',
//     }
//     let map = {}
//     new Array(rand(2, 5)).fill().forEach((_, idx) => {
//       const k = arr[rand(0, arr.length - 1)]
//       map[k] = json[k]
//     })

//     return `
//       .ani-com-${idx}-enter-active, .ani-com-${idx}-leave-active {
//         transition: all 1s;
//       }
//       .ani-com-${idx}-enter, .ani-com-${idx}-leave-to {
//         opacity: 0;
//         transform: ${Object.keys(map).map(v => map[v]).join(" ")};
//       }
//     `
//   }).join('')
//   document.body.appendChild(nodeStyle)
// }