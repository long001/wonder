export default {
  'router': {
    deep: true,
    handler(newVal) {
      const root = this.$root
      let hashData = JSON.stringify(newVal)
      !root.is.local && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + location.search + '#' + hashData

      history[root.isRouterPush ? 'pushState' : 'replaceState']({}, '', targetUrl)
      root.isRouterPush = false
    }
  },
  'router.idxChannel'(newVal) {
    console.warn('%c router.idxChannel', 'color: #09f')
    this.$root.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    console.warn('%c router.idxAlbum', 'color: #09f')
    this.$root.fetchVideoList()
  },
  'router.searchText'(newVal) {
    console.warn('%c router.searchText', 'color: #09f')
    const root = this.$root
    const r = root.router

    root.cctv.sugg.text = r.searchText
    root.clearSugg()
    
    if (newVal) {
      root.justFetchAlbum()
      root.fetchVideoList()
    }
  },
  'router.curPage'(newVal) {
    console.warn('%c router.curPage', 'color: #09f')
    this.$root.fetchVideoList()
  },
  'router.pageSize'(newVal) {
    console.warn('%c router.pageSize', 'color: #09f')
    this.$root.fetchVideoList()
  },
  'router.videoInfo.m3u8'(newVal) {
    console.warn('%c router.videoInfo.m3u8', 'color: #09f')
    if (!newVal) return
    this.$root.playM3u8()
  },
  'mapPlayTime': {
    deep: true,
    handler(newVal) {
      localStorage.mapPlayTime = JSON.stringify(newVal)
    }
  }
}