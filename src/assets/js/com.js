import Vue from 'vue'

Vue.component('player', {
  template: `
    <div class="player">
      <video
        src=""
        id="videoPlayer"
        controls="controls"
        webkit-playsinline=""
        playsinline=""
        x5-playsinline=""
        x-webkit-airplay="allow"
        @timeupdate="handleTimeupdate"
        @ended="$root.playNext()"
      ></video>
    </div>
  `,
  data() {
    return {}
  },
  computed: {
    
  },
  methods: {
    handleTimeupdate(e) {
      const vm = this.$root
      const r = vm.router
      const video = e.target

      video.currentTime > 0 && vm.$set(vm.mapPlayTime, r.videoInfo.m3u8, video.currentTime)
    }
  },
})

Vue.component('pagin', {
  template: `
    <div class="pagin">
      <div class="ib">{{r.totalPage}}</div>
      <div class="ib">
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  `,
  data() {
    return {}
  },
  computed: {
    pageNum() {
      const vm = this.$root
      const r = vm.router
      
      return Math.ceil(r.totalPage / r.pageSize)
    },
    lis() {
      const vm = this.$root
      const r = vm.router
      const curPage = r.curPage
      const pageNum = this.pageNum
      
      if (pageNum < 7) {
        return new Array(pageNum).fill().map((_, idx) => {
          return {n: idx + 1}
        })
      } else {
        if (curPage < 7) {
          return [...new Array(7).fill().map((_, idx) => {
            return {n: idx + 1}
          }), {n: '...', isHide: pageNum < 9}, {n: pageNum, isHide: pageNum < 8}]
        } else if (pageNum - curPage < 6) {
          return [{n: 1, isHide: pageNum < 8}, {n: '...', isPrev: true, isHide: pageNum < 9}, ...new Array(7).fill().map((_, idx) => {
            return {n: pageNum + idx - 6}
          })]
        } else {
          return [{n: 1}, {n: '...', isPrev: true, isHide: 0}, ...new Array(5).fill().map((_, idx) => {
            return {n: curPage + idx - 2}
          }), {n: '...', ieNext: true, isHide: 0}, {n: pageNum}]
        }
      }
    }
  },
  methods: {

  },
})

Vue.component('loading-div', {
  template: `
    <div class="loading-div"
      style="transform: scale(.8)"
    >
      <ul>
        <li
          v-for="n in len"
          :style="{transform: 'rotate(' + (n * (360 / len)) + 'deg) translateY(-16px) scale(.8, 1)', backgroundColor: 'rgba(' + getColorN(n) + ',' + getColorN(n) + ',' + getColorN(n) + ',1)'}"
        ></li>
      </ul>
    </div>
  `,
  data() {
    return {
      len: 12
    }
  },
  methods: {
    getColorN(idx) {
      return parseInt(idx / this.len * 100 + 100)
    }
  }
})

Vue.component('loading', {
  template: `
    <transition name="fade">
      <div class="loading"
        v-if="isShow"
      >
        <loading-div></loading-div>
      </div>
    </transition>
  `,
  props: ['isShow']
})

Vue.component('alert', {
  template: `
    <transition name="fade">
      <div id="alert" class="panel-notice"
        v-if="$root.alertData.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.alertData.msg"></div>
          <div class="box-btn flex">
            <div class="_1 btn-sure" tabindex="1"
              @click="handleSure"
            >确定</div>
          </div>
        </div>
      </div>
    </transition>
  `,
  methods: {
    handleSure() {
      const vm = this.$root

      vm.alertData.isShow = 0
      vm.handleAlertSure && vm.handleAlertSure()
      delete vm.handleAlertSure
    }
  }
})

Vue.component('confirm', {
  template: `
    <transition name="fade">
      <div id="confirm" class="panel-notice"
        v-if="$root.confirmData.isShow"
      >
        <div class="inner">
          <div class="box-msg" v-html="$root.confirmData.msg"></div>
          <div class="box-btn flex">
            <div class="_1 btn-sure" tabindex="1"
              @click="handleSure"
            >确定</div>
            <div class="_2" tabindex="1"
              @click="handleCancel"
            >取消</div>
          </div>
        </div>
      </div>
    </transition>
  `,
  methods: {
    handleSure(e) {
      const vm = this.$root
      
      vm.confirmData.isShow = 0
      vm.handleConfirmSure && vm.handleConfirmSure()
      delete vm.handleConfirmSure
    },
    handleCancel(e) {
      const vm = this.$root
      
      vm.confirmData.isShow = 0
      vm.handleConfirmCancel && vm.handleConfirmCancel()
      delete vm.handleConfirmCancel
    },
  }
})

Vue.component('toggle', {
  template: `
    <div
      :class="['toggle', {on: value}]"
      @click="$emit('change', !value)"
    >
      <div class="circle"></div>
    </div>
  `,
  props: {
    value: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  }
})