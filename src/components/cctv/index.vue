<template>
  <div class="cctv flex-layout">
    <div class="box-list box-channel">
      <ul>
        <li
          v-for="(item, idx) in listChannel"
          :class="['gray-title', {on: idx === r.idxChannel}]"
          tabindex="1"
          @click="clickChannel(item, idx, listChannel)"
        >{{item.name + ' (' + item.children.length + ')'}}</li>
      </ul>
    </div>
    <div class="box-list box-album">
      <ul>
        <li
          v-for="(item, idx) in listAlbum"
          :class="['gray-title', {on: idx === r.idxAlbum}]"
          tabindex="1"
          @click="clickAlbum(item, idx, listAlbum)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="box-main">
      <div class="box-back flex-layout">
        <div class="gray-title">
          <div class="fr btn-box">
            <!-- <span class="btn btn-primary btn-xs">央视直播</span>
            <span class="btn btn-primary btn-xs">本站直播</span> -->
          </div>
          <div class="ellipsis" v-if="$root.isInSearch">{{'搜索结果：' + r.searchText + ' (' + r.totalPage + ')'}}</div>
          <div class="ellipsis" v-else>{{curAlbum.name + ' (' + r.totalPage + ')'}}</div>
        </div>
        <form style="height: 54px;" 
          @submit.prevent="chooseSugg"
        >
          <div class="flex-layout flex-row">
            <div class="auto-flex" style="overflow: visible;">
              <div class="input-group">
                <div class="inner">
                  <input type="text" class="form-control" placeholder="搜点什么..."
                    v-model="sugg.text"
                    @keydown="handleKeydownAndControlSugg"
                    @input="fetchSugg($event)"
                    @click.stop="fetchSugg($event, 1)"
                  >
                  <div class="panel-sugg" v-if="sugg.list.length > 0 && sugg.text.trim()">
                    <ul>
                      <li tabindex="1" 
                        v-for="(item, idx) in sugg.list"
                        :class="['ellipsis', {on: idx === sugg.cur}]"
                        @click="sugg.cur = idx; chooseSugg()"
                      >{{item}}</li>
                    </ul>
                  </div>
                </div>
                <div class="input-group-btn">
                  <button class="btn btn-success" type="submit" @click.stop>
                    <i class="glyphicon glyphicon-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div style="margin-left: 4px;">
              <select
                :class="{select: !$root.is.ios}"
                v-model="r.playDir"
              >
                <option value="0">逆序播放</option>
                <option value="1">顺序播放</option>
              </select>
              <select style="min-width: 72px;" 
                :class="{select: !$root.is.ios}"
                :disabled="$root.is.loading || r.totalPage === 0"
                :value="r.curPage"
                @change="handleChangeCurPage"
              >
                <option
                  :value="n - 1"
                  v-for="n in Math.ceil(r.totalPage / r.pageSize)"
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
            <div style="min-height: 100vh">
              <section-parts :list-data="cctv.listVideo"></section-parts>
              <section-parts :list-data="cctv.searchResult"></section-parts>
            </div>
          </div>

          <loading :is-show="$root.is.loading"></loading>
        </div>
      </div>
      <div class="box-player flex-layout"
        v-if="r.videoInfo.m3u8"
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
            <span>{{r.videoInfo.title}}</span>
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
  vmData() {
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
    r() {
      return this.$root.router
    },
    cctv() {
      return this.$root.cctv
    },
    sugg() {
      return this.cctv.sugg
    },
    listChannel() {
      return this.cctv.channel.list
    },
    curChannel() {
      const vm = this.$root
      const r = vm.router
      
      return this.listChannel[r.idxChannel] || {}
    },
    listAlbum() {
      return this.curChannel.children || []
    },
    curAlbum() {
      const vm = this.$root
      const r = vm.router
      
      return this.listAlbum[r.idxAlbum] || {}
    },
    listVideo() {
      return this.$root.cctv.listVideo
    },
  },
  methods: {
    handleKeydownAndControlSugg(e) {
      const vm = this.$root
      const r = vm.router
      const sugg = vm.cctv.sugg
      const sKey = vm.keyMap[e.keyCode]
      
      switch (sKey) {
        case 'up':
        case 'down':
          e.preventDefault()
          const len = sugg.list.length + 1
          let cur = sugg.cur
          sKey === 'up' ? cur-- : cur++
          cur = (cur % len + len) % len
          sugg.cur = cur
          break
      }
    },
    chooseSugg() {
      const vm = this.$root
      const r = vm.router
      const cctv = vm.cctv
      const sugg = cctv.sugg
      let searchText = sugg.list[sugg.cur] || sugg.text
      
      console.log('搜索：' + searchText)
      vm.updateRouter({
        curPage: 0,
        searchText,
      }, 'push')
      vm.fetchVideoList()
      vm.justFetchAlbum()
    },
    fetchSugg(e, iTimeout) {
      const vm = this.$root
      const r = vm.router
      const sugg = vm.cctv.sugg
      const searchText = sugg.text.trim()

      e.type === 'click' ? clearTimeout(vm.timerFetchSugg) : vm.clearSugg()
      if (!searchText) return
      vm.timerFetchSugg = setTimeout(() => {
        vm.loadScript('https://search.cctv.com/webtvsuggest.php?q=' + encodeURIComponent(searchText), () => {
          const data = window.suggestJSON || []
          sugg.list = data.map(v => v.name)
          sugg.cur = sugg.list.length
        })
      }, iTimeout === undefined ? 240 : iTimeout)
    },
    clickChannel(elItem, idx, arr) {
      const vm = this.$root
      const r = vm.router
      
      vm.updateRouter({
        idxChannel: idx,
        idxAlbum: 0,
        searchText: '',
        curPage: 0,
        totalPage: 0,
        videoInfo: {},
      }, 'push')
      vm.fetchVideoList()
    },
    clickAlbum(elItem, idx) {
      const vm = this.$root
      const r = vm.router
      
      vm.updateRouter({
        idxAlbum: idx,
        searchText: '',
        curPage: 0,
        totalPage: 0,
        videoInfo: {},
      }, 'push')
      vm.fetchVideoList()
    },
    clickAndPlayInCCTV() {
      const vm = this.$root
      const r = vm.router
      
      location.href = r.videoInfo.site
    },
    handleChangeCurPage(e) {
      const vm = this.$root
      const r = vm.router
      
      vm.updateRouter({
        curPage: parseInt(e.target.value)
      }, 'push')
    },
  },
  vmMethods: {
    clearSugg() {
      const vm = this.$root
      const r = vm.router
      const sugg = vm.cctv.sugg

      sugg.cur = sugg.list.length
      sugg.list = []
      clearTimeout(vm.timerFetchSugg)
    },
    playNext() {
      const vm = this.$root
      const r = vm.router
      const cctv = vm.cctv
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
        vm.clickAndFetchVideoUrl(arr[targetIdx])
      }
    },
    justFetchAlbum() {
      const vm = this.$root
      const r = vm.router
      const cctv = vm.cctv
      const searchText = r.searchText.trim()
      const signJustFetchAlbum = vm.signJustFetchAlbum = Math.random()

      clearTimeout(vm.timerJustFetchAlbum)
      vm.timerJustFetchAlbum = setTimeout(() => {
        vm.get('./api/pub.php', {
          a: 'get',
          url: 'https://search.cctv.com/search.php?qtext=' + encodeURIComponent(searchText) + '&type=video'
        }, async (sHtml) => {
          const urls = sHtml.match(/https:\/\/r\.img\.cctvpic\.com\/so\/cctv\/list[^"]*/g) || []
          vm.cctv.searchResult = []

          for (let i = 0; i < urls.length; i++) {
            await new Promise((succ) => {
              const src = urls[i]
              window.playlistArray = {}
              vm.loadScript(src, () => {
                if (signJustFetchAlbum !== vm.signJustFetchAlbum) {
                  succ()
                  return
                }

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

          vm.is.loading = false
          vm.lazyLoad()
        }, 10)
      })
    },
    fetchVideoList() {
      const vm = this.$root
      const r = vm.router
      const curAlbum = ((vm.cctv.channel.list[r.idxChannel] || {}).children || [])[r.idxAlbum]
      const cctv = vm.cctv
      const searchText = r.searchText.trim()
      const signFetchVideoList = vm.signFetchVideoList = Math.random()

      if (!curAlbum) {
        return
      }

      vm.is.loading = true
      vm.clearSugg()

      vm.timerFetchVideoList = setTimeout(async () => {
        if (!searchText) {
          cctv.searchResult = []
          fetchByDefault()
        } else {
          fetchBySearch()
        }

        function fetchByDefault() {
          vm.jsonp('http://api.cntv.cn/lanmu/videolistByColumnId', {
            'id': curAlbum.id,
            'n': 100,
            'of': 'fdate',
            'p': r.curPage + 1,
            'type': '0',
            'serviceId': 'tvcctv',
            '?': 'cb',
          }, (dataOrigin) => {
            if (signFetchVideoList !== vm.signFetchVideoList) return

            dataOrigin.response = dataOrigin.response || {}
            const data = dataOrigin.response.docs || []

            vm.is.loading = false
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

            vm.lazyLoad()
            r.totalPage = dataOrigin.response.numFound || 0
            {
              const el = document.getElementById('boxVideoListAutoScroll')
              el && (el.scrollTop = 0)
            }
          })
        }

        async function fetchBySearch() {
          cctv.listVideo = [{
            title: '全部视频结果共0条',
            list: [],
          }]

          for (let i = 0; i < 5; i++) {
            const _curPage = r.curPage * 5 + i + 1

            if (
              i > 0 && _curPage > Math.ceil(r.totalPage / 20) ||
              signFetchVideoList !== vm.signFetchVideoList
            ) break

            await new Promise((succ) => {
              vm.get('./api/pub.php', {
                a: 'get',
                url: 'https://search.cctv.com/ifsearch.php?page=' + _curPage + '&qtext=' + searchText + '&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=1&qtext_str=' + searchText,
              }, (data) => {
                if (signFetchVideoList !== vm.signFetchVideoList) {
                  succ()
                  return
                }
                r.totalPage = data.total
                const list = data.list.map((item) => {
                  if (/\/\w{32}-\d+\.\w+$/.test(item.imglink)) {
                    const src = item.imglink
                    const rangeL = src.lastIndexOf('/') + 1
                    const rangeR = src.search(/-\d+/)
                    item.id = src.slice(rangeL, rangeR)
                  } else {
                    item.id = ''
                  }

                  // console.log(item.imglink.replace(/^http/, ''), item.id)
                  return {
                    id: item.id,
                    pic: item.imglink,
                    title: '',
                    desc: decodeURIComponent(item.all_title),
                    site: item.urllink,
                    // raw: item,
                  }
                })/*.filter((v) => {
                  return v.site.indexOf('art.cctv.com') > -1
                })*/

                cctv.listVideo[0].title = '全部视频结果共' + r.totalPage + '条'
                cctv.listVideo[0].list = cctv.listVideo[0].list.concat(list)

                vm.is.loading = false
                vm.lazyLoad()
                succ()
              })
            })

            /*{
              const el = document.getElementById('boxVideoListAutoScroll')
              el && (el.scrollTop = 0)
            }*/
          }
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
              <li
                v-for="(item, idx) in item.list"
                :key="item.desc + idx"
              >
                <div class="inner"
                  :style="{backgroundImage: 'url(./static/img/img-blank.png?a)'}"
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
        clickAndFetchVideoUrl(elItemOrigin) {
          const vm = this.$root
          const r = vm.router
          const elItem = vm.clone(elItemOrigin)
          
          vm.is.loading = true
          elItem.title = elItem.title || elItem.desc
          delete elItem.desc
          // console.log(elItem)
          // console.log(JSON.stringify(elItem))

          vm.updateRouter({
            videoInfo: elItem
          }, 'push')

          if (elItem.id) {
            loadScript()
          } else {
            vm.get('./api/pub.php', {
              a: 'get',
              url: elItem.site
            }, (sHtml) => {
              r.videoInfo.id = elItemOrigin.id = elItem.id = 
              (sHtml.match(/"videoCenterId","([^"]*)"/m) || [])[1] || 
              (sHtml.match(/(?:guid = ")(\w{32})(?:")/) || [])[1] || ''
              loadScript()
            })
          }

          function loadScript() {
            if (elItem.id) {
              vm.loadScript('http://vdn.apps.cntv.cn/api/getIpadVideoInfo.do?pid=' + elItem.id + '&tai=ipad&from=html5&tsp=1553074558&vn=2049&vc=8AB31F7208274D1C0FD8874764B5EBE3&uid=2C5D032B73247D87E67C414F62BA2E7B&wlan=')
            } else {
              vm.confirm('无法播放当前视频，点击确定进入央视播放', () => {
                location.href = elItem.site
              }, () => {
                vm.is.loading = false
              })
            }
          }
        },
      },
      mounted() {
        const vm = this.$root
        const r = vm.router
        
        vm.clickAndFetchVideoUrl = this.clickAndFetchVideoUrl
      }
    }
  },
  mounted() {
    const vm = this.$root
    const r = vm.router
    
    // vm.get('./static/data/cctv.json', {
    vm.get(vm.is.local ? './api/pub.php' : './static/data/cctv.json', {
      a: 'getCCTVBasicInfo'
    }, (data) => {
      vm.cctv.channel.list = data
      vm.fetchVideoList()
    })
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
  const vm = window.vm
  const r = vm.router

  vm.is.loading = false
  data = JSON.parse(data)
  vm.$set(r.videoInfo, 'm3u8', data.hls_url)
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
    user-select: none;
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
              margin: 15px 0 12px 0;
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

#boxVideoListAutoScroll > div > div:first-child .section-title {margin-top: 5px !important;}
</style>