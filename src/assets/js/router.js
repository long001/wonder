export default {
  rootMethods: {
    routerInit() {
      const vm = this.$root
      let r = {}

      try {
        r = JSON.parse(decodeURIComponent(location.hash.slice(1)))
      } catch (e) {}

      r.coms = r.coms || []
      r.coms.length === 0 && r.coms.push('cctv')
      r.idxChannel = parseInt(r.idxChannel || 0)
      r.playDir = parseInt(r.playDir === undefined ? 1 : r.playDir)
      r.idxAlbum = parseInt(r.idxAlbum || 0)
      r.countAni = r.countAni || 0
      r.searchText = r.searchText || ''
      r.videoInfo = r.videoInfo || {}
      r.videoInfo.id = r.videoInfo.id || r.videoId
      r.videoInfo.title = r.videoInfo.title || r.videoTitle || ''
      r.videoInfo.m3u8 = r.videoInfo.m3u8 || r.m3u8 || ''
      r.videoInfo.site = r.videoInfo.site || r.site || ''
      if (typeof r.page === 'object') {
        r.curPage = r.page.cur
        r.pageSize = r.page.size
        r.totalPage = r.page.total
      } else {
        r.curPage = parseInt(r.curPage || 0)
        r.pageSize = parseInt(r.pageSize || 100)
        r.totalPage = parseInt(r.totalPage || 0)
      }
      r.dir = r.dir || {}
      r.dir.cur = r.dir.cur || 0
      r.dir.zIndex = r.dir.zIndex || 0
      r.dir = r.dir || {}
      r.dir.list = r.dir.list || []
      delete r.site
      delete r.m3u8
      delete r.page

      Object.keys(r).forEach((key) => {
        vm.$set(vm.router, key, r[key])
      })
    },
    updateRouter(o, isRouterPush) {
      const vm = this.$root
      const r = vm.router
      
      vm.isRouterPush = isRouterPush
      Object.keys(o).forEach((k, idx, arr) => {
        vm.$set(r, k, o[k])
      })
    },
    pushCom(com, o) {
      const root = this.$root
      const r = root.router

      o && root.updateRouter(o)
      if (com === r.coms[0]) return
      root.router.countAni++
      root.isRouterPush = true
      r.coms.unshift(com)
      while (r.coms.length > 2) r.coms.pop()
    },
  }
}