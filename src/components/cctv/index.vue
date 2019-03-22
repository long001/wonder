<template>
  <div class="cctv flex-layout">
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
            <!-- <span class="btn btn-primary btn-xs">央视直播</span>
            <span class="btn btn-primary btn-xs">本站直播</span> -->
          </div>
          <div class="ellipsis" v-if="$root.router.isInSearch">{{'搜索结果：' + $root.router.searchText}}</div>
          <div class="ellipsis" v-else>{{curAlbum.name}}</div>
        </div>
        <form @submit.prevent="handleClickAndChooseSugg()">
          <div class="flex-layout flex-row">
            <div class="auto-flex" style="overflow: visible;">
              <div class="input-group">
                <div class="inner">
                  <input type="text" class="form-control" placeholder="搜点什么..."
                    v-model="sugg.text"
                    @keydown="handleKeydownAndControlSearch($event)"
                    @input="fetchSugg()"
                    @click.stop="fetchSugg(0)"
                  >
                  <div class="panel-sugg" v-if="sugg.list.length > 0 && sugg.text.trim()">
                    <ul>
                      <li tabindex="1" 
                        v-for="(item, idx) in sugg.list"
                        :class="['ellipsis', {on: idx === sugg.cur}]"
                        @click="sugg.cur = idx; handleClickAndChooseSugg()"
                      >{{item}}</li>
                    </ul>
                  </div>
                </div>
                <div class="input-group-btn">
                  <button class="btn btn-success" type="submit">
                    <i class="glyphicon glyphicon-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div style="margin-left: 4px;">
              <select
                :class="{select: !$root.is.ios}"
                v-model="$root.router.playDir"
              >
                <option value="0">逆序播放</option>
                <option value="1">顺序播放</option>
              </select>
              <select style="min-width: 72px;" 
                :class="{select: !$root.is.ios}"
                :disabled="$root.is.loading || $root.router.totalPage === 0"
                :value="$root.router.curPage"
                @change="handleChangeCurPage"
              >
                <option
                  :value="n - 1"
                  v-for="n in Math.ceil($root.router.totalPage / $root.router.pageSize)"
                >{{'第' + n + '页'}}</option>
              </select>
            </div>
          </div>
        </form>
        <div class="auto-flex list-video-wrapper">
          <div class="auto-scroll space" style="padding-top: 0;"
            id="boxVideoListAutoScroll" 
            @scroll="$root.lazyLoad()"
          >
            <section-parts :list-data="cctv.listVideo"></section-parts>
            <section-parts :list-data="cctv.searchResult"></section-parts>
          </div>

          <loading :is-show="$root.is.loading"></loading>
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
          <div class="ellipsis">
            <span class="hidden-sm hidden-xs">正在播放：</span>
            <span>{{$root.router.videoInfo.title}}</span>
          </div>
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
        searchResult: [],
        sugg: {
          cur: -1,
          oldText: '',
          text: '',
          list: [],
        },
      }
    }
  },
  computed: {
    cctv() {
      const root = this.$root

      return root.cctv
    },
    sugg() {
      return this.cctv.sugg
    },
    listChannel() {
      const root = this.$root
      const r = root.router
      
      return root.cctv.channel.list
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
      const root = this.$root
      const r = root.router
      
      return root.cctv.listVideo
    },
  },
  methods: {
    clickChannel(elItem, idx, arr) {
      const root = this.$root
      const r = root.router
      
      root.cctv.sugg.text = ''
      root.updateRouter({
        idxChannel: idx,
        idxAlbum: 0,
        isInSearch: false,
        curPage: 0,
        totalPage: 0,
        videoInfo: {},
      }, 'push')
      root.fetchVideoList()
    },
    clickAlbum(elItem, idx) {
      const root = this.$root
      const r = root.router
      
      root.cctv.sugg.text = ''
      root.updateRouter({
        idxAlbum: idx,
        isInSearch: false,
        curPage: 0,
        totalPage: 0,
        videoInfo: {},
      }, 'push')
      root.fetchVideoList()
    },
    clickAndPlayInCCTV() {
      const root = this.$root
      const r = root.router
      
      location.href = r.videoInfo.site
    },
    fetchSugg(iTimeout) {
      const root = this.$root
      const r = root.router
      const sugg = this.sugg
      const searchText = sugg.text.trim()

      if (!searchText) return

      sugg.oldText = sugg.text
      clearTimeout(root.timerFetchSugg)
      root.timerFetchSugg = setTimeout(() => {
        root.loadScript('https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText), () => {
          const data = window.suggestJSON || []
          root.cctv.sugg.list = data.map(v => v.name)
          sugg.cur = sugg.list.length
        })
      }, iTimeout === undefined ? 200 : iTimeout)
    },
    handleChangeCurPage(e) {
      const root = this.$root
      const r = root.router
      
      root.updateRouter({
        curPage: parseInt(e.target.value)
      }, 'push')
    },
    handleKeydownAndControlSearch(e) {
      const root = this.$root
      const r = root.router
      const sugg = this.sugg
      
      switch (root.keyMap[e.keyCode]) {
        case 'up':
        case 'down':
          e.preventDefault()
          e.keyCode === 38 ? sugg.cur-- : sugg.cur++
          const len = sugg.list.length + 1
          sugg.cur = (sugg.cur % len + len) % len
          sugg.text = sugg.list[sugg.cur] || sugg.oldText
          break
      }
    },
    handleClickAndChooseSugg() {
      const root = this.$root
      const r = root.router
      const sugg = this.sugg
      const isPush = sugg.text.trim() !== r.searchText.trim()
      let isInSearch
      let searchText = ''

      sugg.text = sugg.list[sugg.cur] || sugg.oldText
      searchText = sugg.text.trim()
      isInSearch = !!searchText

      root.updateRouter({
        isInSearch: isInSearch,
        searchText,
        videoInfo: {},
        curPage: 0,
        totalPage: 0,
      }, isPush)

      isInSearch && root.justFetchAlbum()
      root.fetchVideoList()
    },
  },
  rootMethods: {
    playNext() {
      const root = this.$root
      const r = root.router
      const cctv = root.cctv
      let arr = []
      let targetIdx = -1

      cctv.listVideo.concat(cctv.searchResult).forEach((item) => {
        arr = arr.concat(item.list)
      })

      arr.forEach((item, idx, arr) => {
        if (item.id === r.videoInfo.id) {
          targetIdx = idx
        }
      })

      if (targetIdx === -1) {
        console.log('not find')
        return
      }

      r.playDir == '0' ? targetIdx-- : targetIdx++
      if (targetIdx >= 0 && targetIdx < arr.length) {
        root.clickAndFetchVideoUrl(arr[targetIdx])
      }
    },
    clearSugg() {
      const root = this.$root
      const sugg = root.cctv.sugg
      
      clearTimeout(root.timerFetchSugg)
      setTimeout(() => {
        sugg.cur = -1
        sugg.list = []
      }, 1)
    },
    justFetchAlbum() {
      const root = this.$root
      const r = root.router
      const cctv = root.cctv
      const sugg = cctv.sugg
      const searchText = r.searchText.trim()

      // console.warn('%cjustFetchAlbum don\'t fetch', 'color: #0a0')
      clearTimeout(root.timerJustFetchAlbum)
      root.timerJustFetchAlbum = setTimeout(() => {
        // console.warn('%cjustFetchAlbum...', 'color: #0a0')

        root.get('./api/pub.php', {
          a: 'get',
          url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
        }, async (sHtml) => {
          const urls = sHtml.match(/https:\/\/r\.img\.cctvpic\.com\/so\/cctv\/list[^"]*/g) || []

          root.cctv.searchResult = []
          root.is.loading = false

          for (let i = 0; i < urls.length; i++) {
            await new Promise((succ) => {
              const src = urls[i]
              window.playlistArray = {}
              root.loadScript(src, () => {
                Object.keys(playlistArray).forEach((k) => {
                  const data = playlistArray[k]
                  let list = data.video.recent

                  list = list || data.video
                  cctv.searchResult.push({
                    title: decodeURIComponent(data.playlist.title),
                    list: list.map((item) => {
                      item.title = decodeURIComponent(item.title)
                      return {
                        id: item.detailsid,
                        pic: item.imagelink,
                        title: '',
                        desc: item.title,
                        site: item.targetpage,
                      }
                    })
                  })
                })
                succ()
              })
            })
          }

          root.is.loading = false
          root.lazyLoad()
        }, 10)
      })
    },
    fetchVideoList(cb) {
      const root = this.$root
      const r = root.router
      const curAlbum = ((root.cctv.channel.list[r.idxChannel] || {}).children || [])[r.idxAlbum]
      const cctv = root.cctv
      const sugg = cctv.sugg
      const searchText = sugg.text.trim()

      if (!curAlbum) {
        // console.warn('%cfetchVideoList don\'t fetch', 'color: #a00')
        return
      }

      r.pageSize = r.isInSearch ? 20 : 100
      root.is.loading = true
      root.clearSugg()
      clearTimeout(root.timerFetchVideoList)

      root.timerFetchVideoList = setTimeout(async () => {
        // console.warn('%cfetchVideoList ...', 'color: #a00')

        if (!r.isInSearch) {
          cctv.searchResult = []
          fetchByDefault()
        } else {
          fetchBySearch()
        }

        function fetchByDefault() {
          root.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
            'id': curAlbum.id,
            'n': 100,
            'of': 'fdate',
            'p': r.curPage + 1,
            'type': '0',
            'serviceId': 'tvcctv',
            '?': 'cb',
          }, (dataOrigin) => {
            dataOrigin.response = dataOrigin.response || {}
            const data = dataOrigin.response.docs || []

            root.is.loading = false
            cctv.listVideo = [{
              name: '',
              list: data.map((v) => {
                return {
                  id: v.videoSharedCode,
                  pic: v.videoKeyFrameUrl || v.videoKeyFrameUrl2 || v.videoKeyFrameUrl3,
                  title: v.videoTitle || '',
                  desc: v.videoBrief || '',
                  site: v.videoUrl,
                }
              })
            }]

            root.lazyLoad()
            r.totalPage = dataOrigin.response.numFound || 0
            cb && cb()
            document.getElementById('boxVideoListAutoScroll').scrollTop = 0
          })
        }

        async function fetchBySearch() {
          await new Promise((succ) => {
            root.get('./api/pub.php', {
              a: 'get',
              url: 'https://search.cctv.com/ifsearch.php?page=' + r.curPage + '&qtext=' + searchText + '&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=' + searchText,
            }, (data) => {
              r.totalPage = data.total
              const list = data.list.map((item) => {
                item.title = decodeURIComponent(item.all_title)
                const rangeL = item.imglink.lastIndexOf('/') + 1
                const rangeR = item.imglink.search(/-\d+/)
                
                item.id = rangeR > -1 ? item.imglink.slice(rangeL, rangeR) : ''

                return {
                  id: item.id,
                  pic: item.imglink,
                  title: '',
                  desc: item.title,
                  site: item.urllink,
                }
              })

              cctv.listVideo = [{
                title: '全部视频结果共' + r.totalPage + '条',
                list,
              }]

              root.is.loading = false
              root.lazyLoad()
              succ()
            })

            cb && cb()
          })
          
          document.getElementById('boxVideoListAutoScroll').scrollTop = 0
        }
      }, 10)
    }
  },
  components: {
    'section-parts': {
      template: `
        <div>
          <section
            v-for="(item, idx) in listData"
          >
            <div class="section-title"
              v-if="item.title"
            >
              <strong>{{item.title}}</strong>
            </div>
            <ul class="list-video">
              <li v-for="(item, idx) in item.list">
                <div class="inner"
                  :style="{backgroundImage: 'url(./static/img/img-blank.png)'}"
                  :lazy-load="item.pic"
                  :title="item.desc"
                  :key="item.title"
                  @click="clickAndFetchVideoUrl(item)"
                  tabindex="1"
                >
                  <div class="text-box">
                    <div class="title line-2"
                      v-if="item.title"
                    >{{item.title}}</div>
                    <div class="desc line-2"
                      v-if="item.desc"
                    >{{item.desc.length > 40 ? item.desc.slice(0, 40) + '...' : item.desc}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      `,
      props: ['listData'],
      methods: {
        clickAndFetchVideoUrl(elItem) {
          const root = this.$root
          const r = root.router

          elItem = root.clone(elItem)
          elItem.title = elItem.title || elItem.desc
          delete elItem.desc

          root.updateRouter({
            videoInfo: elItem
          }, 'push')

          if (elItem.id) {
            loadScript()
          } else {
            root.get('./api/pub.php', {
              a: 'get',
              url: elItem.site
            }, (sHtml) => {
              r.videoInfo.id = elItem.id = (sHtml.match(/"videoCenterId","([^"]*)"/m) || [])[1] || ''
              loadScript()
            })
          }

          function loadScript() {
            if (!elItem.id) {
              alert('无法播放当前视频，点击确定进入央视播放')
              location.href = elItem.site
              return
            }

            const src = 'http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1553074558&vn=2049&vc=8AB31F7208274D1C0FD8874764B5EBE3&uid=2C5D032B73247D87E67C414F62BA2E7B&wlan='
            root.loadScript(src)
          }
        },
      },
      mounted() {
        const root = this.$root
        const r = root.router
        
        root.clickAndFetchVideoUrl = this.clickAndFetchVideoUrl
      }
    }
  },
  mounted() {
    const root = this.$root
    const r = root.router
    
    // root.get('./static/data/cctv.json', {
    root.get(root.is.local ? './api/pub.php' : './static/data/cctv.json', {
      a: 'getCCTVBasicInfo'
    }, (data) => {
      root.cctv.channel.list = data
      root.fetchVideoList()
    })

    r.isInSearch && root.justFetchAlbum()
    this.sugg.text = r.searchText
  },
}

{
  const nodeStyle = document.createElement('style')

  nodeStyle.innerHTML = new Array(50).fill().map((_, idx) => {
    return `
      @media (min-width: ${idx * 280 + 500}px) {
        .cctv > .box-main .list-video li {
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

<style lang="scss">
.cctv {
  flex-direction: row;
  & > div {
    overflow: auto;
  }
  & > .box-channel,
  & > .box-album {
    background: #eee; white-space: nowrap;
    border-left: 1px solid #fff;
    border-right: 1px solid #dddedf;
    ul {
      padding-bottom: 100px;
      li {
        overflow: hidden; cursor: pointer;
      }
    }
  }
  & > .box-main {
    flex: 1; overflow-x: hidden; overflow-y: auto; position: relative;
    & > div {
      width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: 1;
    }
    .box-back {
      form {
        padding: 10px 12px;
        .form-control {
          border-radius: 4px 0 0 4px;
        }
      }
      .list-video-wrapper {
        div {
          section {
            .section-title {
              margin: 20px 0 12px 0;
            }
          }
        }
        .list-video {
          margin: -2px;
          li {
            display: inline-block; padding: 2px; vertical-align: top;
            & > .inner {
              padding-top: 62.5%; cursor: pointer; overflow: hidden;
              background: #eee no-repeat center / cover;
              .text-box {
                width: 100%; position: absolute; left: 0; bottom: 0; color: #fff; background: rgba(0,0,0,.5); padding: 8px;
                .title {margin-bottom: 5px;}
              }
            }
          }
        }
      }
      .panel-sugg {
        width: 100%; background: #fff; position: absolute; left: 0; top: 100%; z-index: 2;
        box-shadow: 0 0 5px rgba(0,0,0,.2);
        ul {
          padding: 6px 0;
          li {
            padding: 6px 12px; cursor: pointer;
            &:hover {background: #eee;}
            &.on {background: #eee;}
          }
        }
      }
    }
    .box-player {

    }
  }
}

@media (max-width: 600px) {
  .cctv {
    & > .box-main {
      .box-back {
        .panel-sugg {
          min-width: calc(100vw - 24px);
        }
      }
    }
  }
}

@media (max-width: 850px) {
  .cctv {
    font-size: 12px;
  }
}
@media (max-width: 550px) {
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
      .box-back {
        .list-video-wrapper {
          .list-video {
            li {
              width: 50%;
            }
          }
        }
      }
    }
  }
}

#boxVideoListAutoScroll > div:first-child .section-title {margin-top: 5px !important;}
</style>