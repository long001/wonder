<template>
  <div class="topbar lmr" :style="{paddingTop: $root.topPt}">
    <div class="fl box-logo a-hidden-xs">
      <a href="javascript:">Codding.cn</a>
    </div>
    <div class="fr"
      v-if="$root.urlSearchData.isInApp"
    >
      <ul>
        <li>
          <a href="javascript:" onclick="location.reload()">刷新</a>
        </li>
        <li>
          <a href="javascript:" onclick="history.back()">后退</a>
        </li>
        <li>
          <a href="javascript:" onclick="history.forward()">前进</a>
        </li>
        <!-- <li>
          <a href="javascript:">后台管理</a>
        </li> -->
      </ul>
    </div>
    <div class="mid nav ellipsis">
      <ul class="list-unstyled">
        <li
          v-for="(item, idx) in $root.nav.list"
          :class="{on: item.com === $root.com}"
          @click="$root.pushCom(item.com)"
          v-if="!item.isHide"
        >
          <a href="javascript:">{{item.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  rootData() {
    const vm = this.$root
    const r = vm.router

    setTimeout(() => {
      vm.nav.list = [
        {name: 'CCTV', com: 'cctv'},
        {name: 'WebFTP', com: 'webFtp', isHide: !vm.is.local},
        // {name: 'DBAdmin', com: 'dbAdmin'},
        // {name: 'TinyBug', com: 'tinyBug'},
        // {name: 'Talker', com: 'talker'},
      ]
    }, 0)

    return {
      nav: {
        list: []
      }
    }
  },
  rootMethods() {
    const vm = this.$root
    const r = vm.router
    
    return {

    }
  },
}
</script>

<style scoped lang="scss">
.topbar {
  background: #33373e; line-height: 3em;
  position: relative; z-index: 10; color: #fff;
  user-select: none;
  .box-logo {
    font-size: 16px; font-weight: bold; margin-right: 0;
  }
  ul {
    margin-bottom: 0;
    li {
      display: inline-block;
      color: #c3c6c9;
      &.on {
        color: #fff;
      }
    }
  }
  a {display: block; padding: 0 12px;}
}

</style>