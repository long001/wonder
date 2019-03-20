<template>
  <div class="topbar">
    <div class="fl box-logo hidden-xs">
      <a href="javascript:">Codding.cn</a>
    </div>
    <div class="nav fl">
      <ul class="list-unstyled">
        <li
          v-for="(item, idx) in $root.nav.list"
          :class="{on: item.com === $root.router.coms[0]}"
        >
          <a href="javascript:">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="fr">
      <a href="javascript:">后台管理</a>
    </div>
  </div>
</template>

<script>
export default {
  rootData() {
    const root = this.$root
    const r = root.router

    return {
      nav: {
        list: [
          {name: 'CCTV', com: 'cctv'},
          {name: 'webFTP', com: 'webFTP'},
          {name: 'dbAdmin', com: 'dbAdmin'},
        ]
      }
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
.topbar {
  background: #33373e; color: #fff; line-height: 1.5em;
  .box-logo {
    font-size: 16px; font-weight: bold; margin-right: 15px;
  }
  .nav {
    ul {
      margin-bottom: 0;
      li {
        display: inline-block;
      }
    }
  }
  form {
    padding: 0 0 0 15px;
    .form-control {
      background: rgba(0,0,0,.15); border: none; color: #fff; transition: .5s all;
      &:focus {
        background-color: rgba(0,0,0,.4); outline: none; box-shadow: none;
      }
    }
  }
  a {display: block; padding: 12px 12px;}
}

</style>