import Hls from 'hls.js'

export default {
  rootData() {
    const root = this.$root
    const ua = navigator.userAgent
    const isLocal = ['localhost', '808'].some(k => location.origin.indexOf(k) > -1)
    const isIos = ua.indexOf('like Mac OS X') > -1
    const isAndroid = ua.indexOf('Android') > -1
    const isWin = ua.indexOf('Windows NT') > -1

    return {
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
        '65': 'a',
        '66': 'b',
        '67': 'c',
        '68': 'd',
        '69': 'e',
        '70': 'f',
        '71': 'g',
        '72': 'h',
        '73': 'i',
        '74': 'j',
        '75': 'k',
        '76': 'l',
        '77': 'm',
        '78': 'n',
        '79': 'o',
        '80': 'p',
        '81': 'q',
        '82': 'r',
        '83': 's',
        '84': 't',
        '85': 'u',
        '86': 'v',
        '87': 'w',
        '88': 'x',
        '89': 'y',
        '90': 'z',
      },
      localUrl: 'http://192.168.10.103/wonder/',
      ex: {},
      router: {
        coms: [],
        videoInfo: {},
        searchText: '',
      },
      urlSearchData: {},
    }
  },
  rootMethods: {
    clone(o) {
      return JSON.parse(JSON.stringify(o))
    },
    initUrlSearchData() {
      const root = this.$root
      const urlSearchData = {}

      location.search.slice(1).split('&').forEach((str) => {
        if (!str) return
        const tmp = str.split('=')

        try {
          tmp[1] = decodeURIComponent(tmp[1])
        } catch (e) {}

        urlSearchData[tmp[0]] = tmp[1]
      })

      root.urlSearchData = urlSearchData
    },
    initEvents() {
      const root = this.$root

      window.onresize = root.lazyLoad.bind(root)
      window.onpopstate = root.routerInit.bind(root)
    },
    init() {
      const root = this.$root

      root.initUrlSearchData()
      root.initEvents()
      root.routerInit()
    }
  }
}
