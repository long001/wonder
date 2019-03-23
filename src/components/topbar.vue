<template>
  <div class="topbar lmr">
    <div class="fl box-logo hidden-xs">
      <a href="javascript:">Codding.cn</a>
    </div>
    <div class="fr">
      <a href="javascript:">后台管理</a>
    </div>
    <div class="mid nav ellipsis">
      <ul class="list-unstyled">
        <li
          v-for="(item, idx) in $root.nav.list"
          :class="{on: item.com === $root.router.coms[0]}"
        >
          <a href="javascript:">{{item.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  vmData() {
    const vm = this.$root
    const r = vm.router

    return {
      nav: {
        list: [
          {name: 'CCTV', com: 'cctv'},
          {name: 'WebFTP', com: 'webFTP'},
          {name: 'DBAdmin', com: 'dbAdmin'},
          {name: 'TinyBug', com: 'tinyBug'},
          {name: 'Talker', com: 'talker'},
        ]
      }
    }
  },
  vmMethods() {
    const vm = this.$root
    const r = vm.router
    
    return {

    }
  },
}
</script>

<style scoped lang="scss">
.topbar {
  background: #33373e; color: #fff; line-height: 3em;
  .box-logo {
    font-size: 16px; font-weight: bold; margin-right: 0;
  }
  .nav {
    ul {
      margin-bottom: 0;
      li {
        display: inline-block;
      }
    }
  }
  a {display: block; padding: 0 12px;}
}

</style>