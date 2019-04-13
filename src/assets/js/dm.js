import Hls from 'hls.js'

export default {
  rootData() {
    const vm = this.$root
    const ua = navigator.userAgent
    const isLocal = location.port === '6835'
    const isIos = ua.indexOf('like Mac OS X') > -1
    const isAndroid = ua.indexOf('Android') > -1
    const isWin = ua.indexOf('Windows NT') > -1

    return {
      lenAni: 30,
      localUrl: 'http://10.0.1.2/wonder/',
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
        '8': 'backspace',
        '13': 'enter',
        '27': 'esc',
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down',
        '46': 'delete',
        '65': 'a', '66': 'b', '67': 'c', '68': 'd', '69': 'e',
        '70': 'f', '71': 'g', '72': 'h', '73': 'i', '74': 'j',
        '75': 'k', '76': 'l', '77': 'm', '78': 'n', '79': 'o',
        '80': 'p', '81': 'q', '82': 'r', '83': 's', '84': 't',
        '85': 'u', '86': 'v', '87': 'w', '88': 'x', '89': 'y',
        '90': 'z', 
        '113': 'f2',
      },
      ex: {},
      router: {
        coms: [],
        videoInfo: {},
        searchText: '',
        dir: {
          cur: 0,
          zIndex: 0,
          isUpdateExtension: false,
          list: [],
        },
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
  rootMethods: {
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    getFileName(path) {
      path = path.split('/').last()
      return path.substr(0, path.lastIndexOf('.')) || ''
    },
    getFileType(path) {
      path = path.split('/').last()
      return path.substr(path.lastIndexOf('.') + 1) || ''
    },
    alert(msg, cb) {
      const vm = this.$root

      vm.alertData.isShow = true
      vm.alertData.msg = msg
      vm.handleAlertSure = cb
    },
    confirm(msg, cbSure, cbCancel) {
      const vm = this.$root

      vm.confirmData.isShow = true
      vm.confirmData.msg = msg
      vm.handleConfirmSure = cbSure
      vm.handleConfirmCancel = cbCancel
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
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'y':
              history.forward()
              break
            case 'z':
              history.back()
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'esc':
              vm.alertData.isShow = false
              vm.confirmData.isShow = false
              vm.webFtp && (vm.webFtp.dir.new.isShow = 0)
              break
          }
        }
      }, false)
    },
    init() {
      const vm = this.$root

      vm.initUrlSearchData()
      vm.initEvents()
      vm.routerInit()
    }
  }
}
