export default {
  isInSearch() {
    return !!this.$root.router.searchText
  },
  topPt() {
    const vm = this.$root

    if (vm.urlSearchData.isInApp) {
      if (vm.dw < vm.dh) {
        return vm.urlSearchData.isSpecialScreen === "true" ? '35px' : '20px'
      } else {
        return '20px'
      }
    } else {
      return '0px'
    }
  },
  com() {
    return (this.$root.router.coms || [])[0] || ''
  },
}