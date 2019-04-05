<template>
  <div class="web-ftp" ref="webFtpEl">
    <div class="dir-list"
      ref="dirList"
      @contextmenu.prevent="handleContextmenu"
    >
      <section
        v-for="(dirItem, idx) in r.dir.list"
        :key="dirItem.k"
        :data-key="dirItem.k"
        :dir-index="idx"
        :class="['dir', {cur: idx === r.dir.cur}]"
        :style="dirItem.style"
      >
        <div class="lmr gray-title">
          <div class="fr">
            <span>{{(dir.map[dirItem.path] || []).length}}</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove"></i>
          </div>
          <div class="mid path-box">
            <input type="text" class="path-input" 
              :value="dirItem.path"
              @keydown.enter="updateDirPath($event, dirItem)"
            >
          </div>
        </div>
        <div class="auto-scroll">
          <!-- <pre>{{dir.map[dirItem.path]}}</pre> -->
          <div class="space"
            v-if="(dir.map[dirItem.path] || {}).msg"
          >
            <div class="alert alert-danger">{{dir.map[dirItem.path].msg}}</div>
          </div>
          <ul class="file-list" v-else>
            <li
              class="file"
              v-for="(item, idx) in dir.map[dirItem.path]"
              :data-idx="idx"
              :is-dir="item.isDir"
            >
              <i class="glyphicon glyphicon-file"></i>
              <div class="file-name">{{item.name}}</div>
            </li>
          </ul>
        </div>
        <div class="resize">
          <div class="line">
            <div class="l"></div>
            <div class="t"></div>
            <div class="r"></div>
            <div class="b"></div>
          </div>
          <div class="corner">
            <div class="lt"></div>
            <div class="rt"></div>
            <div class="rb"></div>
            <div class="lb"></div>
          </div>
        </div>
      </section>
    </div>

    <transition name="fade">
      <div class="mask mask-open-dir"
        v-if="dir.new.isShow"
        @click="dir.new.isShow = false"
      >
        <div class="inner"
          @click.stop
        >
          <div class="gray-title lmr">
            <div class="fr">
              <i class="glyphicon glyphicon-remove"
                @click="dir.new.isShow = false"
              ></i>
            </div>
            <div class="mid">打开文件夹</div>
          </div>
          <form class="space"
            @submit.prevent="exec('打开文件夹')"
          >
            <table class="table-form">
              <tr>
                <td>
                  <input type="text" class="form-control" required placeholder="输入路径" 
                    v-model="dir.new.path"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="submit" value="确定" class="btn btn-success btn-block" />
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </transition>

    <div class="select-rect" ref="selectRect" style="display: none;"></div>

    <div id="fix-menu">
      <ul>
        <li cmd="新建文件夹">新建文件夹</li>
        <li cmd="上传文件">上传文件</li>
        <li cmd="上传文件夹">上传文件夹</li>
        <li cmd="粘贴">粘贴</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const vm = this.$root
    const r = vm.router
    
    return {
      dir: {
        new: {
          path: '',
          isShow: false,
        },
        map: {},
      },
    }
  },
  methods: {
    correctPath(path) {
      return (path + '/').replace(/(\\|\/)+/g, '/')
    },
    async loopOpenDir() {
      const me = this
      const vm = me.$root
      const r = vm.router
      const list = r.dir.list

      vm.oldTime = Date.now()
      for (let i = 0; i < list.length; i++) {
        const path = list[i].path
        await new Promise((succ, err) => {
          me.openDir(path, succ)
        })
      }
    },
    openDir(path, cb) {
      const me = this
      const vm = me.$root
      const dir = me.dir

      if (dir.map[path]) {
        cb && cb()
        return
      }

      vm.$set(dir.map, path, [])
      vm.get('./api/webFtp.php', {
        a: 'openDir',
        path,
      }, (list) => {
        vm.oldTime = Date.now()
        dir.map[path] = list.sort((a, b) => {
          return b.isDir - a.isDir
        })
        cb && cb()
      }, (xhr, data) => {
        vm.$set(dir.map, path, data)
        cb && cb()
      })
    },
    exec(action) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dir = me.dir

      switch (action) {
        case '自动排版':
          console.log('自动排版')
          break
        case '打开文件夹':
          // console.log('打开文件夹')
          const path = me.correctPath(me.dir.new.path)
          vm.isRouterPush = true
          r.dir.list.push({
            path,
            k: ++r.dir.zIndex,
            style: {
              width: '400px',
              height: '400px',
              left: '30px',
              top: '30px',
              zIndex: ++r.dir.zIndex,
            }
          })
          r.dir.cur = r.dir.list.length - 1
          me.openDir(path)
          me.dir.new.isShow = 0
          break
        case '批量打开文件夹':
          {
            const dirEl = document.querySelector('.dir-list .cur')
            const lis = [].slice.call(document.querySelectorAll('.dir-list .cur [is-dir=true][draggable=true]'))

            if (lis.length > 0) {
              const delDir = r.dir.list.splice(r.dir.cur, 1)[0]
              const pos = {
                left: dirEl.offsetLeft,
                top: dirEl.offsetTop,
              }

              vm.isRouterPush = true
              lis.forEach((li, idx, arr) => {
                ++r.dir.zIndex
                r.dir.list.splice(r.dir.cur + idx, 0, {
                  path: delDir.path + li.children[1].innerHTML,
                  k: r.dir.zIndex,
                  style: {
                    width: delDir.style.width,
                    height: delDir.style.height,
                    left: pos.left + idx * 24 + 'px',
                    top: pos.top + idx * 24 + 'px',
                    zIndex: r.dir.zIndex,
                  }
                })
              })
            }
          }
          break
        case '新建文件夹':
          console.log('新建文件夹')
          break
        case '全选':
          ;[].slice.call(document.querySelectorAll('.dir-list .cur .dir-list li')).forEach((li) => {
            li.draggable = true
          })
          break
        case '复制':
          console.log('复制')
          break
        case '剪切':
          console.log('剪切')
          break
        case '粘贴':
          console.log('粘贴')
          break
        case '选中路径':
          {
            const node = document.querySelector('.dir-list section:nth-child(' + (r.dir.cur + 1) + ') .path-input')
            node.focus()
            node.select()
          }
          break
        case '删除':
          console.log('删除')
          break
        case '重命名':
          console.log('重命名')
          break
        case '下载':
          console.log('下载')
          break
        case '下载zip':
          console.log('下载zip')
          break
        case '上传文件':
          console.log('上传文件')
          break
        case '上传文件夹':
          console.log('上传文件夹')
          break
      }
    },
    handleContextmenu(e) {
      console.log(e)
    },
    updateDirPath(e, dirItem) {
      const me = this
      const vm = me.$root
      
      vm.isRouterPush = true
      e.target.value = dirItem.path = me.correctPath(e.target.value);
      e.target.blur();
    },
    initEvents() {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dir = me.dir
      const {webFtpEl, dirList, selectRect} = me.$refs

      dirList.onmousedown = (e) => {
        const target = e.target
        const fileList = target.closest('.file-list')
        const grayTitle = target.closest('.gray-title')
        const autoScroll = target.closest('.auto-scroll')
        const resize = target.closest('.resize')

        const ctrlKey = e.ctrlKey
        const shiftKey = e.shiftKey
        const x1 = e.clientX + webFtpEl.scrollLeft
        const y1 = e.clientY + webFtpEl.scrollTop

        let dirEl = target.closest('.dir')
        let originX = dirEl.offsetLeft
        let originY = dirEl.offsetTop
        let originW = dirEl.offsetWidth
        let originH = dirEl.offsetHeight
        let rDir = {}

        r.dir.cur = parseInt(dirEl.getAttribute('dir-index'))
        rDir = r.dir.list[r.dir.cur]
        rDir.style.zIndex = ++r.dir.zIndex

        if (grayTitle) {
          startDrag()
        } else if (resize) {
          startResize()
        } else if (fileList) {
          autoScroll.appendChild(selectRect)
          selectRect.style.width = 
          selectRect.style.height = 0
          startSelect()
        }

        function startDrag() {
          e.preventDefault()

          if (e.altKey) {
            vm.isRouterPush = true
            rDir = vm.clone(rDir)
            rDir.k = ++r.dir.zIndex
            rDir.style.zIndex = r.dir.zIndex
            r.dir.cur++
            r.dir.list.splice(r.dir.cur, 0, rDir)
            vm.$nextTick(() => {
              dirEl = dirList.children[r.dir.cur]
              dirEl.style.transition = 'none'
            })
          } else {
            dirEl.style.transition = 'none'
          }

          document.onmousemove = (e) => {
            const x2 = e.clientX + webFtpEl.scrollLeft
            const y2 = e.clientY + webFtpEl.scrollTop

            let x = x2 - x1 + originX
            let y = y2 - y1 + originY

            x = x < 0 ? 0 : x
            y = y < 0 ? 0 : y

            dirEl.style.left = x + 'px'
            dirEl.style.top = y + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = document.onmouseup = null
            dirEl.style.transition = ''
            vm.isRouterPush = true
            rDir.style.left = dirEl.offsetLeft + 'px'
            rDir.style.top = dirEl.offsetTop + 'px'
          }
        }

        function startResize() {
          const sClass = target.className
          const isL = sClass.indexOf('l') > -1
          const isT = sClass.indexOf('t') > -1
          const iMin = 300
          const attr = ({
            'l': ['left', 'width'],
            't': ['top', 'height'],
            'r': ['width'],
            'b': ['height'],
            'lt': ['left', 'top', 'width', 'height'],
            'rt': ['top', 'width', 'height'],
            'rb': ['width', 'height'],
            'lb': ['left', 'width', 'height'],
          })[sClass]

          dirEl.style.transition = 'none'

          document.onmousemove = (e) => {
            const o = {}
            const x2 = e.clientX + webFtpEl.scrollLeft
            const y2 = e.clientY + webFtpEl.scrollTop

            const disX = x2 - x1
            const disY = y2 - y1

            o.left = disX + originX
            o.top = disY + originY
            o.width = (isL ? -disX : disX) + originW
            o.height = (isT ? -disY : disY) + originH

            if (o.left < 0) {
              o.width += o.left
              o.left = 0
            }

            if (o.top < 0) {
              o.height += o.top
              o.top = 0
            }

            if (o.width < iMin) {
              isL && (o.left -= iMin - o.width)
              o.width = iMin
            }

            if (o.height < iMin) {
              isT && (o.top -= iMin - o.height)
              o.height = iMin
            }

            attr.forEach((attr) => {
              dirEl.style[attr] = o[attr] + 'px'
            })
          }

          document.onmouseup = (e) => {
            document.onmousemove = document.onmouseup = null
            dirEl.style.transition = ''
            vm.isRouterPush = true
            rDir.style.width = dirEl.offsetWidth + 'px'
            rDir.style.height = dirEl.offsetHeight + 'px'
            rDir.style.left = dirEl.offsetLeft + 'px'
            rDir.style.top = dirEl.offsetTop + 'px'
          }
        }

        function startSelect() {
          e.preventDefault()

          const lis = [].slice.call(fileList.children).map((li) => {
            return {
              l: li.offsetLeft,
              t: li.offsetTop,
              r: li.offsetLeft + li.offsetWidth,
              b: li.offsetTop + li.offsetHeight,
              ctrlSign: ctrlKey ? li.draggable : undefined,
              shiftSign: shiftKey ? li.draggable : undefined,
              li,
            }
          })
          const pos = autoScroll.getBoundingClientRect()
          let startX = e.clientX + autoScroll.scrollLeft - pos.left
          let startY = e.clientY + autoScroll.scrollTop - pos.top
          let isMoved = false

          document.onmousemove = fnMove
          document.onmouseup = fnUp

          function fnMove(e) {
            const x2 = e.clientX
            const y2 = e.clientY

            let endX = e.clientX + autoScroll.scrollLeft - pos.left
            let endY = e.clientY + autoScroll.scrollTop - pos.top

            let l = Math.min(startX, endX)
            let t = Math.min(startY, endY)
            let w = Math.abs(startX - endX)
            let h = Math.abs(startY - endY)
            let r = l + w
            let b = t + h

            isMoved = x1 !== x2 || y1 !== y2
            isMoved && (selectRect.style.display = '')

            if (!isMoved) return

            if (l < 0) {
              w += l
              l = 0
            }

            if (t < 0) {
              h += t
              t = 0
            }

            if (w > autoScroll.scrollWidth - l) {
              w = autoScroll.scrollWidth - l
            }

            if (h > autoScroll.scrollHeight - t) {
              h = autoScroll.scrollHeight - t
            }

            selectRect.style.left = l + 'px'
            selectRect.style.top = t + 'px'
            selectRect.style.width = w + 'px'
            selectRect.style.height = h + 'px'

            lis.forEach((v) => {
              const li = v.li
              const isColl = !(
                v.l > r ||
                v.r < l ||
                v.t > b ||
                v.b < t
              )
              if (e.ctrlKey) {
                li.draggable = isColl ? !v.ctrlSign : v.ctrlSign
              } else if (e.shiftKey) {
                li.draggable = isColl || v.shiftSign
                isColl && delete v.shiftSign
              } else {
                li.draggable = isColl
              }
            })

            clearTimeout(vm.timerDirScroll)
            const _e = {
              clientX: e.clientX,
              clientY: e.clientY,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
            }

            if (e.clientY > pos.top && e.clientY < pos.bottom) {
              return
            }

            {
              const isScrollToTop = e.clientY < pos.top
              let dis = isScrollToTop ? e.clientY - pos.top : e.clientY - pos.bottom

              dis /= 5
              dis = dis > 0 ? Math.ceil(dis) : Math.floor(dis)
              autoScroll.scrollTop += dis

              vm.timerDirScroll = setTimeout(() => {
                fnMove(_e)
              }, 13)
            }
          }

          function fnUp(e) {
            const target = e.target
            const li = target.closest('li')

            document.onmousemove = document.onmouseup = null
            dirEl.style.transition = ''
            selectRect.style.display = 'none'
            clearTimeout(vm.timerDirScroll)

            if (isMoved) {
              delete fileList.oldLi
            } else {
              // 点选
              if (e.ctrlKey) {
                if (li) {
                  li.draggable = !li.draggable
                  fileList.oldLi = li
                }
              } else if (e.shiftKey) {
                const startLi = fileList.oldLi || fileList.querySelector('[draggable=true]') || fileList.children[0]
                const endLi = li

                if (endLi) {
                  const _idxStart = parseInt(startLi.getAttribute('data-idx'))
                  const _idxEnd = parseInt(endLi.getAttribute('data-idx'))
                  const idxStart = Math.min(_idxStart, _idxEnd)
                  const idxEnd = Math.max(_idxStart, _idxEnd)

                  lis.forEach((v, idx) => {
                    v.li.draggable = idx >= idxStart && idx <= idxEnd
                  })
                }
              } else {
                lis.forEach((v) => {
                  v.li.draggable = false
                })
                if (li) {
                  li.closest('li').draggable = true
                  fileList.oldLi = li
                }
              }
            }
          }
        }
      }

      document.onkeydown = (e) => {
        if (e.ctrlKey && e.shiftKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey && e.shiftKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'f':
              {
                const dw = document.querySelector('.web-ftp .dir-list').clientWidth - 10
                const col = Math.floor(dw / 350)
                const size = parseInt(dw / col) - 10
                let row = -1

                vm.isRouterPush = true
                r.dir.list.forEach((v, idx) => {
                  const style = v.style

                  idx % col === 0 && row++
                  style.width = style.height = size + 'px'
                  style.left = idx % col * (size + 10) + 10 + 'px'
                  style.top = row * (size + 10) + 10 + 'px'
                })
                setTimeout(() => {
                  vm.isRouterPush = false
                }, 2)
              }
              break
          }
        } else if (e.shiftKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'a':
              if (document.activeElement.nodeName.toLowerCase() !== 'input') {
                ;[].slice.call(document.querySelectorAll('.dir-list .cur li')).forEach((li, idx, arr) => {
                  li.draggable = true
                })
              }
              break
          }
        } else if (e.shiftKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.altKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'd':
              e.preventDefault()
              me.exec('选中路径')
              break
            case 'o':
              dir.new.isShow = true
              dir.new.path = ''
              break
            case 'w':
              vm.isRouterPush = true
              r.dir.list.splice(r.dir.cur, 1)
              r.dir.cur--
              r.dir.cur < 0 && (r.dir.cur = 0)
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'enter':
              me.exec('批量打开文件夹')
              break
          }
        }
      }
    }
  },
  computed: {
    r() {
      return this.$root.router
    }
  },
  watch: {
    'dir.new.isShow'(newVal) {
      const vm = this.$root
      const r = vm.router
      
      if (!newVal) return

      this.$nextTick(() => {
        const node = document.querySelector('.mask-open-dir .inner .form-control')
        console.log(node)
        node && node.focus()
      })
    },
  },
  destroyed() {
    document.onkeydown = null
  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router
    
    r.dir.zIndex = Math.max(r.dir.zIndex, r.dir.list.length)
    me.initEvents()
    me.loopOpenDir()
  }
}
</script>

<style scoped lang="scss">
.web-ftp {
  background: #d3d6d9 !important;
  // &:focus {background: wheat !important;}
  .dir-list {
    user-select: none;
    .dir {
      width: 400px; height: 400px;
      position: absolute; left: 20px; top: 20px; 
      overflow: hidden; margin-bottom: 5em; background: #fff;
      box-shadow: 0 4px 15px rgba(0,0,0,.3);
      border-radius: 4px;
      transition: .3s all;
      .gray-title {
        cursor: move; padding-left: 6px;
        input {
          cursor: inherit;
          outline: none; text-indent: 6px;
          background: transparent;
          border: 1px solid transparent;
          height: 24px; line-height: 24px;
          width: 100%;
          &:focus {
            border-color: #ccc;
            background: #fff;
          }
        }
        .fr {
          padding-top: 2px; height: 20px;
        }
      }
      .auto-scroll {
        top: 35px;
        .file-list {
          min-height: 100%; text-align: center; word-break: break-all; overflow: hidden;
          padding-bottom: 5em; padding-right: 5px; margin-bottom: 0;
           text-align: center;
          .file {
            width: 75px; height: 75px;
            margin: 5px 0 0 5px; padding-top: .4em;
            float: left; border: 1px solid transparent;
          }
          .file:hover {background: rgb(229,243,255);}
          .file:active {background: rgb(216,234,255);}
          .file[draggable=true] {background: #ddd; border-color: #ccc;}
          .file .glyphicon {font-size: 28px; cursor: inherit;}
          .file[is-dir=true] .glyphicon:before {color: #fd5;}
          .file .file-name {
            line-height: 1.4em; max-height: 2.8em;
            font-size: 12px; overflow: hidden; padding: 0 .2em;
            // display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
          }
        }
      }
      &.cur .auto-scroll .file-list .file[draggable=true] {
        background: rgb(204,232,255); border-color: rgb(153,209,255);
      }
      .dragover {background: #f3f6f9;}
      .auto-scroll .file-list .file.cut {opacity: .75;}

      .resize {
        & > div > div {
          width: 6px; height: 6px;
          position: absolute; left: 0; top: 0;
        }
        .line > div {}
        .line {
          .l {height: 100%; cursor: w-resize;}
          .t {width: 100%; cursor: n-resize;}
          .r {height: 100%; left: auto; right: 0; cursor: e-resize;}
          .b {width: 100%; top: auto; bottom: 0; cursor: s-resize;}
        }
        .corner > div {width: 12px; height: 12px;}
        .corner {
          .lt {cursor: nw-resize;}
          .rt {left: auto; right: 0; cursor: ne-resize;}
          .rb {left: auto; right: 0; top: auto; bottom: 0; cursor: se-resize;}
          .lb {top: auto; bottom: 0; cursor: sw-resize;}
        }
      }
    }
  }

  .select-rect {
    width: 100px; height: 100px;
    position: absolute; left: 50px; top: 50px;
    background: rgba(0,170,255,.5); border: 1px solid #09f;
    pointer-events: none;
  }

  #fix-menu {
    min-width: 80px; background: #fff; color: #555;
    white-space: nowrap;
    display: none;
    position: fixed; left: 50px; top: 100px; z-index: 2;
    border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,.3);
    user-select: none;
    ul {
      padding: 8px 0; margin-bottom: 0;
      li {
        padding: 4px 15px; cursor: pointer;
        &:hover {
          background: #337ab7; color: #fff;
        }
      }
    }
  }
}
</style>