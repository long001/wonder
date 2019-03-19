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
  }
}