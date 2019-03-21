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
      const root = this.$root
      const r = root.router
      const video = e.target

      video.currentTime > 0 && root.$set(root.mapPlayTime, r.videoInfo.m3u8, video.currentTime)
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
      const root = this.$root
      const r = root.router
      
      return Math.ceil(r.totalPage / r.pageSize)
    },
    lis() {
      const root = this.$root
      const r = root.router
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