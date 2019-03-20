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
      r.idxAlbum = parseInt(r.idxAlbum || 0)
      r.searchText = r.searchText || ''
      r.curPage = parseInt(r.curPage || 0)
      r.pageSize = parseInt(r.pageSize || 100)
      r.totalPage = parseInt(r.totalPage || 0)
      r.videoInfo = r.videoInfo || {}
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