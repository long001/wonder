<template>
  <div id="app"
    @click="handleClickPanel"
  >
    <div class="flex-layout">
      <topbar></topbar>
      <div class="main-container">
        <transition-group name="fade">
          <div
            v-for="(item, idx) in $root.router.coms"
            :key="idx + '-' + item"
            :is="item"
          ></div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
const coms = [
  {name: 'topbar', path: 'components/topbar'},
  
  {name: 'cctv', path: 'components/cctv'},
  {name: 'webFtp', path: 'components/webFtp'},
  {name: 'dbAdmin', path: 'components/dbAdmin'},
].map((item) => {
  item.com = require('@/' + item.path).default
  return item
})

export default {
  name: 'App',
  rootData() {
    const root = this.$root
    
    return {
      ...(() => {
        let map = {}
        coms.forEach((item, idx, arr) => {
          item.com.rootData && (map = {...map, ...item.com.rootData.call(root)})
        })
        return map
      })()
    }
  },
  methods: {
    handleClickPanel(e) {
      const root = this.$root
      root.clearSugg()
    }
  },
  rootMethods: {
    ...(() => {
      let map = {}
      coms.forEach((item, idx, arr) => {
        map = {...map, ...item.com.rootMethods}
      })
      return map
    })()
  },
  components: {
    ...(() => {
      const map = {}
      coms.forEach((item, idx, arr) => {
        map[item.name] = item.com
      })
      return map
    })(),
  },
  mounted() {
    const root = this.$root
    const r = root.router
    
    
  }
}
</script>

<style scoped lang="scss">
#app {
  height: 100%; background: #fff;
  display: flex; flex-direction: column;
  .main-container {
    flex: 1; position: relative;
    & > span {
      height: 100%; display: block; position: relative;
      & > div {
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; overflow: auto;
      }
    }
  }
}
</style>