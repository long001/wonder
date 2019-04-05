<template>
  <div id="app" @click="$root.clearSugg">
    <div class="flex-layout">
      <topbar></topbar>
      <div class="main-container">
        <!-- <transition-group :name="'ani-com-' + ($root.router.countAni % $root.lenAni)"> -->
        <transition-group :name="'fade'">
          <div
            v-for="(item, idx) in $root.router.coms"
            :key="item.com + '-' + idx"
            :is="item"
            v-if="idx === 0"
          ></div>
        </transition-group>
      </div>
    </div>

    <confirm></confirm>
    <alert></alert>
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
  data() {
    return {
      
    }
  },
  rootData() {
    const vm = this.$root
    
    return {
      ...(() => {
        let map = {}
        coms.forEach((item, idx, arr) => {
          item.com.rootData && (map = {...map, ...item.com.rootData.call(vm)})
        })
        return map
      })()
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
    const vm = this.$root
    const r = vm.router
    
    vm.app = this
  },
}
</script>

<style scoped lang="scss">
#app {
  height: 100%; background: #000; overflow: hidden;
  display: flex; flex-direction: column;
  .main-container {
    flex: 1; position: relative;
    & > span {
      width: 100%; height: 100%; position: absolute;
      // transform-style: preserve-3d; transform: perspective(800px);
      & > div {
        width: 100%; height: 100%; position: absolute; left: 0; top: 0;
        background: #fff; overflow: auto;
      }
    }
  }
}
</style>