const fs = require('fs')
const coms = [
  // 'cross',
  // 'pc',
  // 'mobile',
  'cctv',
  'webFtp',
  'dbAdmin',
]

coms.forEach((dir) => {
  let path = './' + dir

  try {
    const info = fs.statSync(path)
  } catch (e) {
    fs.mkdirSync(path)
  }

  /*fs.writeFileSync(path + '/index.vue', 
`<template>
  <div class="${dir}">
    ${dir}
  </div>
</template>

<script>
export default {
  rootData() {
    const root = this.$root
    const r = root.router
    
    return {

    }
  },
  rootMethods() {
    const root = this.$root
    const r = root.router
    
    return {

    }
  },
}
</script>

<style scoped lang="scss">
.${dir} {
  
}
</style>
`
)*/
})