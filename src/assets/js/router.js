export default {
  rootMethods: {
    routerInit() {
      const root = this.$root
      let r = {}

      try {
        r = JSON.parse(decodeURIComponent(location.hash.slice(1)))
      } catch (e) {}

      r.coms = r.coms || []
      r.coms.length === 0 && r.coms.push('cctv')
      r.idxChannel = parseInt(r.idxChannel || 0)
      r.playDir = parseInt(r.playDir || '0')
      r.idxAlbum = parseInt(r.idxAlbum || 0)
      r.searchText = r.searchText || ''
      r.videoInfo = r.videoInfo || {}
      r.videoInfo.id = r.videoInfo.id || r.videoId
      r.videoInfo.title = r.videoInfo.title || r.videoTitle
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
      delete r.site
      delete r.m3u8
      delete r.page
      root.router = r
    },
    updateRouter(o, isRouterPush) {
      const root = this.$root
      const r = root.router
      
      root.isRouterPush = isRouterPush
      Object.keys(o).forEach((k, idx, arr) => {
        root.$set(r, k, o[k])
      })
    },
  }
}