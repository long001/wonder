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
    this.$root.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    this.$root.fetchVideoList()
  },
  'router.searchText'(newVal) {
    if (!newVal) return
    this.$root.fetchVideoList()
  },
  'router.curPage'(newVal) {
    this.$root.fetchVideoList()
  },
  'router.pageSize'(newVal) {
    this.$root.fetchVideoList()
  },
  'router.videoInfo.m3u8'(newVal) {
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