import Hls from 'hls.js'

export default {
  vmData() {
    const vm = this.$root
    const ua = navigator.userAgent
    const isLocal = ['localhost', '808'].some(k => location.origin.indexOf(k) > -1)
    const isIos = ua.indexOf('like Mac OS X') > -1
    const isAndroid = ua.indexOf('Android') > -1
    const isWin = ua.indexOf('Windows NT') > -1

    return {
      lenAni: 30,
      localUrl: 'http://192.168.10.103/wonder/',
      dw: window.innerWidth,
      dh: window.innerHeight,
      is: {
        local: isLocal,
        ios: isIos,
        android: isAndroid,
        win: isWin,
        loading: true,
        supportM3u8: !!document.createElement('video').canPlayType('application/vnd.apple.mpegurl'),
        supportHls: Hls.isSupported(),
      },
      keyMap: {
        '13': 'enter',
        '27': 'esc',
        '38': 'up',
        '39': 'right',
        '40': 'down',
        '37': 'left',
      },
      ex: {},
      router: {
        coms: [],
        videoInfo: {},
        searchText: '',
      },
      alertData: {
        isShow: 0,
        msg: 'Hello Again'
      },
      confirmData: {
        isShow: 0,
        msg: 'Hello Again'
      },
      urlSearchData: {},
    }
  },
  vmMethods: {
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    alert(msg, cb) {
      const vm = this.$root

      vm.alertData.isShow = true
      vm.alertData.msg = msg
      vm.handleAlertSure = cb
    },
    confirm(msg, cb) {
      const vm = this.$root

      vm.confirmData.isShow = true
      vm.confirmData.msg = msg
      vm.handleConfirmSure = cb
    },
    initUrlSearchData() {
      const vm = this.$root
      const urlSearchData = {}

      location.search.slice(1).split('&').forEach((str) => {
        if (!str) return
        const tmp = str.split('=')

        try {
          tmp[1] = decodeURIComponent(tmp[1])
        } catch (e) {}

        urlSearchData[tmp[0]] = tmp[1]
      })

      vm.urlSearchData = urlSearchData
    },
    initEvents() {
      const vm = this.$root

      window.onpopstate = vm.routerInit.bind(vm)
      window.onresize = window.onorientationchange = (e) => {
        vm.dw = window.innerWidth
        vm.dh = window.innerHeight
        vm.lazyLoad.call(vm)
      }
      document.onkeydown = (e) => {
        switch (vm.keyMap[e.keyCode]) {
          case 'esc':
            vm.alertData.isShow = false
            vm.confirmData.isShow = false
            break
        }
      }
    },
    init() {
      const vm = this.$root

      vm.initUrlSearchData()
      vm.initEvents()
      vm.routerInit()
    }
  }
}
