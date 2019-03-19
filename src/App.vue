<template>
  <div id="app">
    app
  </div>
</template>

<script>
const coms = [
  {name: 'cross', path: 'components/cross'},
  {name: 'pc', path: 'components/pc'},
  {name: 'mobile', path: 'components/mobile'},
  {name: 'webFtp', path: 'components/webFtp'},
  {name: 'dbAdmin', path: 'components/dbAdmin'},
].map((item) => {
  item.com = require('@/' + item.path).default
  return item
})

export default {
  name: 'App',
  components: {

  }
}
</script>

<style scoped lang="scss">
#app {
  height: 100%; background: #fff;
}
</style>