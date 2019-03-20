<template>
  <div class="cctv flex-layout flex-row">
    <div class="box-list box-channel">
      <ul>
        <li
          v-for="(item, idx) in listChannel"
          :class="['gray-title', {on: idx === $root.router.idxChannel}]"
          tabindex="1"
          @click="clickChannel(item, idx, listChannel)"
        >{{item.name + ' (' + item.children.length + ')'}}</li>
      </ul>
    </div>
    <div class="box-list box-album">
      <ul>
        <li
          v-for="(item, idx) in listAlbum"
          :class="['gray-title', {on: idx === $root.router.idxAlbum}]"
          tabindex="1"
          @click="clickAlbum(item, idx, listAlbum)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="box-main">
      <div class="box-back flex-layout">
        <div class="gray-title">
          <div class="fr btn-box">
            <span class="btn btn-primary btn-xs" onclick="location.reload()">刷新</span>
            <span class="btn btn-primary btn-xs">央视直播</span>
            <span class="btn btn-primary btn-xs">本站直播</span>
          </div>
          <div class="ellipsis">{{curAlbum.name}}</div>
        </div>
        <form
          @submit.prevent="$root.updateRouter({isInSearch: true, searchText: $refs.searchInput.value}, 'push')"
        >
          <div class="input-group space" style="padding: 10px 12px;">
            <input type="text" class="form-control" placeholder="搜点什么..."
              ref="searchInput"
              :value="$root.router.searchText"
              @input="fetchSugg"
            >
            <span class="input-group-btn">
              <button class="btn btn-success" type="submit">
                <i class="glyphicon glyphicon-search"></i>
              </button>
            </span>
          </div>
        </form>
        <div class="auto-flex space"
          style="padding-top: 0" 
          @scroll="$root.lazyLoad()"
        >
          <ul>
            <li v-for="(item, idx) in $root.cctv.listVideo">
              <div class="inner"
                :style="{backgroundImage: 'url(./static/img/img-blank.png)'}"
                :lazy-load="item.pic"
                :title="item.desc"
                :key="idx * $root.router.curPage + idx + item.title"
                @click="clickAndFetchVideoUrl(item, idx, $root.cctv.listVideo)"
                tabindex="1"
              >
                <div class="text-box">
                  <div class="title line-2"
                    v-if="item.title"
                  >{{item.title}}</div>
                  <div class="desc line-2"
                    v-if="item.desc"
                  >{{item.desc.length > 40 ? item.desc.slice(0, 40) + '...' : ''}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="box-player flex-layout"
        v-if="$root.router.videoInfo.m3u8"
      >
        <div class="gray-title">
          <div class="btn-box fr">
            <span class="btn btn-success btn-xs"
              @click="clickAndPlayInCCTV()"
            >央视播放</span>
            <span class="btn btn-warning btn-xs"
              @click="$root.updateRouter({videoInfo: {}}, 'push')"
            >关闭视频</span>
          </div>
          <div class="ellipsis">{{$root.router.videoInfo.title}}</div>
        </div>
        <div class="auto-flex">
          <player></player>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  rootData() {
    const root = this.$root
    const r = root.router
    let mapPlayTime = {}

    try {
      mapPlayTime = JSON.parse(localStorage.mapPlayTime)
    } catch (e) {}

    return {
      mapPlayTime,
      cctv: {
        channel: {
          list: []
        },
        listVideo: [],
      }
    }
  },
  computed: {
    listChannel() {
      return this.$root.cctv.channel.list
    },
    curChannel() {
      const root = this.$root
      const r = root.router
      
      return this.listChannel[r.idxChannel] || {}
    },
    listAlbum() {
      return this.curChannel.children || []
    },
    curAlbum() {
      const root = this.$root
      const r = root.router
      
      return this.listAlbum[r.idxAlbum] || {}
    },
    listVideo() {
      return this.$root.cctv.listVideo
    },
  },
  methods: {
    clickChannel(elItem, idx, arr) {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        idxChannel: idx,
        idxAlbum: 0,
        isInSearch: false,
        videoInfo: {},
      }, 'push')
    },
    clickAlbum(elItem, idx, arr) {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        idxAlbum: idx,
        isInSearch: false,
        videoInfo: {},
      }, 'push')
    },
    clickAndFetchVideoUrl(elItem, idx, listVideo) {
      const root = this.$root
      const r = root.router

      root.updateRouter({
        videoInfo: elItem
      }, 'push')

      const script = document.createElement('script')
      script.src = 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1553074558&vn=2049&vc=8AB31F7208274D1C0FD8874764B5EBE3&uid=2C5D032B73247D87E67C414F62BA2E7B&wlan='
      document.body.appendChild(script)
    },
    clickAndPlayInCCTV() {
      const root = this.$root
      const r = root.router
      
      location.href = r.videoInfo.site
    },
    fetchSugg(e) {
      const root = this.$root
      const r = root.router
      const searchText = e.target.value.trim()
      
      console.log(searchText)
    },
  },
  rootMethods: {
    fetchVideoList() {
      const root = this.$root
      const r = root.router
      const curAlbum = ((root.cctv.channel.list[r.idxChannel] || {}).children || [])[r.idxAlbum]

      if (!curAlbum) {
        // console.warn('%cfetchVideoList don\'t fetch', 'color: #a00')
        return
      } else {
        // console.warn('%cfetchVideoList ...', 'color: #a00')
      }

      root.is.loading = true

      clearTimeout(root.timerFetchVideoList)
      root.timerFetchVideoList = setTimeout(() => {
        root.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
          'id': curAlbum.id,
          'n': 100,
          'of': 'fdate',
          'p': r.curPage,
          'type': '0',
          'serviceId': 'tvcctv',
          '?': 'cb',
        }, (dataOrigin) => {
          dataOrigin.response = dataOrigin.response || {}
          const data = dataOrigin.response.docs || []
          // console.warn('%cfetchVideoList result', 'color: #a00', data)

          root.is.loading = false
          root.cctv.listVideo = data.map((v) => {
            return {
              id: v.videoSharedCode,
              pic: v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3,
              title: v.videoTitle || '',
              desc: v.videoBrief || '',
              site: v.videoUrl,
            }
          })
          root.lazyLoad()
          r.totalPage = dataOrigin.response.numFound || 0
        })
      }, 1)
    }
  },
  mounted() {
    const root = this.$root
    const r = root.router
    
    // root.get('./static/data/cctv.json', {
    root.get('./api/pub.php', {
      a: 'getCCTVBasicInfo'
    }, (data) => {
      root.cctv.channel.list = data
      root.fetchVideoList()
    })
  },
}

{
  const nodeStyle = document.createElement('style')

  nodeStyle.innerHTML = new Array(50).fill().map((_, idx) => {
    return `
      @media (min-width: ${idx * 280 + 500}px) {
        .cctv > .box-main ul li {
          width: ${1 / (idx + 2) * 100}%;
        }
      }
    `
  }).join('')

  document.body.appendChild(nodeStyle)
}

window.getHtml5VideoData  = function(data) {
  const root = window.vm
  const r = root.router

  data = JSON.parse(data)
  root.$set(r.videoInfo, 'm3u8', data.hls_url)
}

</script>

<style scoped lang="scss">
.cctv {
  display: flex;
  & > div {
    overflow: auto;
  }
  & > .box-channel,
  & > .box-album {
    border-right: 1px solid #dddedf; background: #eee; white-space: nowrap;
    // min-width: 184px;
    ul {
      padding-bottom: 100px;
      li {
        height: 36px; overflow: hidden;
      }
    }
  }
  & > .box-main {
    flex: 1; overflow-x: hidden; overflow-y: auto; position: relative;
    & > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 1;
    }
    .box-back {
      ul {
        margin: -2px;
        li {
          display: inline-block; padding: 2px; vertical-align: top;
          & > .inner {
            padding-top: 62.5%; cursor: pointer; overflow: hidden;
            background: #eee no-repeat center / cover;
            .text-box {
              font-size: 12px;
              width: 100%; position: absolute; left: 0; bottom: 0; color: #fff; background: rgba(0,0,0,.5); padding: 8px;
              .title {margin-bottom: 5px;}
            }
          }
        }
      }
    }
    .box-player {

    }
  }
}

@media (max-width: 500px) {
  .cctv {
    flex-direction: column;
    & > .box-channel,
    & > .box-album {
      ul {
        padding-bottom: 0; margin-bottom: 0;
        li {
          display: inline-block; vertical-align: top;
          &.on {background: #eee; color: #08e;}
        }
      }
    }
    .box-main {
      ul {
        li {
          width: 50%;
        }
      }
    }
  }
}

/* @media (max-width: 500px) {
.cctv {
  flex-direction: row;
  & > .box-channel,
  & > .box-album {
    ul {
      li {
        display: inline-block;
      }
    }
  }
} */
</style>