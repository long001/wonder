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
      },
      router: {},
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

      window.onpopstate = root.routerInit.bind(root)
    },
    routerInit() {
      const root = this.$root
      let r = {}

      try {
        r = JSON.parse(decodeURIComponent(location.hash.slice(1)))
      } catch (e) {}

      r.coms = r.coms || []
      r.curPage = parseInt(r.curPage || 0)
      r.pageSize = parseInt(r.pageSize || 100)
      r.totalPage = parseInt(r.totalPage || 0)
      root.router = r
    },
    init() {
      const root = this.$root

      root.initUrlSearchData()
      root.initEvents()
      root.routerInit()
    }
  }
}