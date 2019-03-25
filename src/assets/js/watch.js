export default {
  'router': {
    deep: true,
    handler(newVal) {
      const vm = this.$root
      let hashData = JSON.stringify(newVal)
      !vm.is.local && (hashData = encodeURIComponent(hashData))
      const targetUrl = location.origin + location.pathname + location.search + '#' + hashData

      history[vm.isRouterPush ? 'pushState' : 'replaceState']({}, '', targetUrl)
      vm.isRouterPush = false
    }
  },
  'router.idxChannel'(newVal) {
    console.warn('%c change router.idxChannel', 'color: #08e')
    this.$root.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    console.warn('%c change router.idxAlbum', 'color: #08e')
    this.$root.fetchVideoList()
  },
  'router.searchText'(newVal) {
    console.warn('%c change router.searchText', 'color: #08e')
    const vm = this.$root
    const r = vm.router

    vm.cctv.sugg.text = r.searchText
    
    if (newVal) {
      vm.fetchVideoList()
      vm.justFetchAlbum()
    }
  },
  'router.curPage'(newVal) {
    console.warn('%c change router.curPage', 'color: #08e')
    this.$root.fetchVideoList()
  },
  'router.pageSize'(newVal) {
    console.warn('%c change router.pageSize', 'color: #08e')
    this.$root.fetchVideoList()
  },
  'router.videoInfo.m3u8'(newVal) {
    console.warn('%c change router.videoInfo.m3u8', 'color: #08e')
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