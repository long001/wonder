const fs = require('fs')
const coms = [
  'cross',
  'pc',
  'mobile',
  'webFtp',
  'dbAdmin',
]

coms.forEach((dir) => {
  let path = './' + dir

  try {
    const info = fs.statSync(path)
    console.log(info)
  } catch (e) {
    fs.mkdirSync(path)
  }

//   fs.writeFileSync(path + '/index.vue', 
// `<template>
//   <div class="${dir}">
//     ${dir}
//   </div>
// </template>

// <script>
// export default {

// }
// </script>

// <style scoped lang="scss">
// .${dir} {
  
// }
// </style>
// `
// )
})