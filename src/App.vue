<template>
  <div id="app" @click="$root.clearSugg">
    <div class="flex-layout">
      <topbar></topbar>
      <div class="main-container">
        <transition-group :name="'ani-com-' + ($root.router.countAni % $root.lenAni)">
        <!-- <transition-group :name="'fade'"> -->
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
  {name: 'webFTP', path: 'components/webFTP'},
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
  height: 100%; background: #000; overflow: hidden;
  display: flex; flex-direction: column;
  .main-container {
    flex: 1; position: relative; z-index: 5;
    & > span {
      width: 100%; height: 100%; position: absolute;
      transform-style: preserve-3d; transform: perspective(800px);
      & > div {
        width: 100%; height: 100%; position: absolute; left: 0; top: 0;
        background: #fff; overflow: auto;
      }
    }
  }
}
</style>