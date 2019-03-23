<template>
  <div id="app" @click="$root.clearSugg">
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
  vmData() {
    const vm = this.$root
    
    return {
      ...(() => {
        let map = {}
        coms.forEach((item, idx, arr) => {
          item.com.vmData && (map = {...map, ...item.com.vmData.call(vm)})
        })
        return map
      })()
    }
  },
  vmMethods: {
    ...(() => {
      let map = {}
      coms.forEach((item, idx, arr) => {
        map = {...map, ...item.com.vmMethods}
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