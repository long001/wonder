export default {
  rootMethods: {
    lazyLoad() {
      const root = this.$root
      const dh = window.innerHeight
      
      clearTimeout(root.timerLazyLoad)
      root.timerLazyLoad = setTimeout(() => {
        ;[].slice.call(document.querySelectorAll('[lazy-load]')).forEach((node) => {
          const pos = node.getBoundingClientRect()

          if (pos.top > dh || pos.bottom < 0) return

          const src = node.getAttribute('lazy-load')
          node.style.backgroundImage = 'url(' + src + ')'
          node.removeAttribute('lazy-load')
        })
      }, 240)
    }
  }
}
