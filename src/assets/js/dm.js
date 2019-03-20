import Hls from 'hls.js'

export default {
  rootData() {
    const root = this.$root
    const ua = navigator.userAgent
    const isLocal = ['localhost', '808'].some(k => location.origin.indexOf(k) > -1)
    const isIos = ua.indexOf('iPhone OS') > -1
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