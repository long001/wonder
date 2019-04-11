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
    this.$root.fetchVideoList()
  },
  'router.idxAlbum'(newVal) {
    this.$root.fetchVideoList()
  },
  'router.searchText'(newVal) {
    const vm = this.$root
    const r = vm.router

    vm.cctv.sugg.text = r.searchText
    vm.fetchVideoList()
    newVal && vm.justFetchAlbum()
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
  },
  'router.dir.list': {
    deep: true,
    handler(newVal) {
      const vm = this.$root
      vm.webFtp && vm.webFtp.loopOpenDir()
    }
  }
}