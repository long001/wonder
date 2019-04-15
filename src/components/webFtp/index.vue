<template>
  <div class="web-ftp flex-layout" ref="webFtpEl">
    <div class="gray-title">
      <div class="fr btn-box">
        <span class="btn btn-primary btn-xs"
          @click.stop="exec($event, '打开文件夹')"
        >打开文件夹</span>
        <span class="btn btn-primary btn-xs"
          @click="exec($event, '自动排版')"
        >自动排版</span>
        <span class="btn btn-danger btn-xs"
          :disabled="!dir.mapSelected[curPath]"
          @click="exec($event, '删除')"
        >删除</span>
      </div>
      <div class="ellipsis">
        <div class="ib p">
          <i class="glyphicon glyphicon-info-sign" style="top: 2px;"></i>
          <span>快捷操作</span>
        </div>
      </div>
    </div>
    <div class="auto-flex">
      <div class="dir-list"
        ref="dirList"
        @contextmenu.prevent="exec($event, '显示右键菜单')"
      >
        <section
          v-for="(dirItem, idx) in r.dir.list"
          :key="dirItem.k"
          :data-key="dirItem.k"
          :dir-idx="idx"
          :class="['dir', {cur: idx === r.dir.cur}]"
          :style="dirItem.style"
        >
          <div class="lmr gray-title">
            <div class="fr">
              <span v-if="(dir.map[dirItem.path] || []).length > 0">
                {{dir.mapSelected[dirItem.path] || 0}} / 
                {{(dir.map[dirItem.path] || []).length}}
              </span>
              <i class="glyphicon glyphicon-pencil"></i>
              <i class="glyphicon glyphicon-remove"
                @click="exec($event, '关闭面板')"
              ></i>
            </div>
            <div class="mid path-box">
              <input type="text" class="path-input" 
                :value="dirItem.path"
                @keydown.stop.enter="updateDirPath($event, dirItem)"
              >
            </div>
          </div>
          <div class="auto-scroll">
            <div class="space"
              v-if="(dir.map[dirItem.path] || {}).msg"
            >
              <div class="alert alert-danger">{{dir.map[dirItem.path].msg}}</div>
            </div>
            <ul class="file-list" v-else
              @dragstart="handleDragStart"
            >
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
    </div>

    <transition name="fade">
      <div class="mask mask-open-dir"
        v-if="dir.open.isShow"
      >
        <div class="inner" @click.stop>
          <div class="gray-title lmr">
            <div class="fr">
              <i class="glyphicon glyphicon-remove"
                @click="dir.open.isShow = false"
              ></i>
            </div>
            <div class="mid">打开文件夹</div>
          </div>
          <form class="space"
            @submit.prevent="exec($event, 'do打开文件夹')"
          >
            <table class="table-form">
              <tr>
                <td>
                  <input type="text" class="form-control" required 
                    placeholder="打开文件夹"
                    v-model="dir.open.path"
                    @keydown.stop="keyMap[$event.keyCode] === 'esc' && $root.doClear();"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <span class="ib" style="margin-right: 15px;">自动转换 。->. OR 、->/</span>
                  <toggle
                    v-model="r.dir.isChangeChinese"
                  ></toggle>
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

    <transition name="fade">
      <div class="mask mask-operate-dir"
        style="user-select: none;" 
        v-if="dir.new.isShow"
      >
        <div class="inner" @click.stop>
          <div class="gray-title lmr">
            <div class="fr">
              <i class="glyphicon glyphicon-remove"
                @click="dir.new.isShow = false"
              ></i>
            </div>
            <div class="mid">{{(dir.new.isRename ? '重命名' : '新建') + (dir.new.isDir ? '文件夹' : '文件')}}</div>
          </div>
          <form class="space"
            @submit.prevent="exec($event, 'do操作文件(夹)')"
          >
            <table class="table-form">
              <tr>
                <td>
                  <input type="text" class="form-control" required 
                    placeholder="名称"
                    v-model="dir.new.name"
                    @keydown.stop="keyMap[$event.keyCode] === 'esc' && $root.doClear();"
                  />
                </td>
              </tr>
              <tr v-if="dir.new.isRename && dir.mapSelected[curPath] !== 1">
                <td>
                  <span class="ib" style="margin-right: 15px;">修改后缀</span>
                  <toggle
                    v-model="r.dir.isUpdateExtension"
                  ></toggle>
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

    <div id="fix-menu"
      ref="fixMenu"
      v-if="fixMenu.isShow"
      :style="{left: fixMenu.style.l + 'px', top: fixMenu.style.t + 'px', 'z-index': r.dir.zIndex + 1}"
    >
      <ul>
        <li
          v-for="(item, idx) in fixMenu.list"
          :cmd="item"
          @click="exec($event, item)"
        >{{item}}</li>
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
      fixMenu: {
        isShow: false,
        style: {
          l: 100,
          t: 100,
        },
        list: []
      },
      dir: {
        open: {
          isShow: false,
          path: '',
        },
        new: {
          isShow: false,
          isDir: true,
          isRename: false,
          isFileMove: false,
          dirFrom: '',
          dirTo: '',
          name: '',
          // names: [],
        },
        map: {},
        mapSelected: {},
      },
    }
  },
  methods: {
    handleDragStart(e) {
      const me = this
      const dir = me.dir

      dir.new.isFileMove = true
      dir.new.isRename = true
      dir.new.dirFrom = me.curPath
      dir.new.names = me.getSelectedFiles()
    },
    getSelectedFiles() {
      return [].slice.call(document.querySelectorAll('.web-ftp .dir-list .dir.cur li[draggable=true] .file-name')).map(n => n.innerText.trim())
    },
    correctPath(path) {
      const me = this
      const root = me.$root
      const r = root.router
      
      r.dir.isChangeChinese && (path = path.replace('。', '.').replace('、', '/'))
      path = path.replace(/(\\|\/)+/g, '/').replace(/\/$/, '')
      return path
    },
    async loopOpenDir() {
      const me = this
      const vm = me.$root
      const r = vm.router
      const list = r.dir.list

      for (let i = 0; i < list.length; i++) {
        await new Promise((succ, err) => {
          me.openDir(list[i].path, succ)
        })
      }
    },
    forceOpenDir(path) {
      const me = this
      const dir = me.dir

      path = path || me.curPath

      Object.keys(me.dir.map).forEach((_path) => {
        if (_path.indexOf(path) === 0) {
          me.$delete(me.dir.map, _path)
          me.$delete(me.dir.mapSelected, _path)
        }
      })

      me.loopOpenDir()
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
        const dirs = []
        let group = {}

        list.forEach((item, idx, arr) => {
          item.type = vm.getFileType(item.name)

          if (item.isDir) {
            dirs.push(item)
          } else {
            group[item.type] = group[item.type] || []
            group[item.type].push(item)
          }
        })

        dirs.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })

        group = Object.keys(group).map((type) => {
          return {
            type,
            arr: group[type].sort((a, b) => {
              return a.name.localeCompare(b.name)
            })
          }
        }).sort((a, b) => a.type.localeCompare(b.type)).map(v => v.arr)

        dir.map[path] = dirs.concat(Array.prototype.concat.apply([], group))
        cb && cb()
      }, (xhr, data) => {
        console.log(xhr, data)
        vm.$set(dir.map, path, data)
        cb && cb()
      })

      dir.new.isShow = false
    },
    exec(e, action) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const dir = me.dir
      let data = {}

      switch (action) {
        case '自动排版':
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

            me.$nextTick(() => {
              vm.isRouterPush = false
            })
          }
          break
        case '新建文件夹':
        case '新建文件':
          if (me.curPath) {
            e.stopPropagation()
            dir.new.isShow = true
            dir.new.isRename = false
            dir.new.isDir = action === '新建文件夹'
            dir.new.isFileMove = false
            dir.new.name = ''
            dir.new.dirFrom = ''
            dir.open.isShow = false
            me.fixMenu.isShow = false
          }
          break
        case '重命名':
          {
            const node = document.querySelector('.web-ftp .dir.cur li[draggable=true] .file-name')
            if (!node) break

            e.stopPropagation()
            dir.new.isShow = true
            dir.new.isRename = true
            dir.new.isFileMove = false
            dir.new.name = node.innerText
            dir.open.isShow = false
            me.fixMenu.isShow = false
            me.$nextTick(() => {
              const node = document.querySelector('.mask-operate-dir .form-control')
              node.focus()
              node.value.indexOf('.') > -1 ?
              node.setSelectionRange(0, node.value.lastIndexOf('.')) :
              node.select()
            })
          }
          break
        case 'do操作文件(夹)':
          dir.new.name = dir.new.name.trim()

          if (dir.new.isFileMove) {
            // 文件移动
            data = {
              a: 'rename',
              isFileMove: true,
              dirFrom: dir.new.dirFrom,
              dirTo: me.curPath,
              names: dir.new.names,
            }

            if (dir.map[me.curPath].msg) {
              console.log(dir.map[me.curPath].msg)
              return
            }
          } else {
            if (dir.new.isRename) {
              // 重命名
              data = {
                a: 'rename',
                dirFrom: me.curPath,
                dirTo: me.curPath,
                newName: dir.new.name,
                names: JSON.stringify(me.getSelectedFiles()),
                isUpdateExtension: r.dir.isUpdateExtension || '',
              }
            } else {
              // 新建文件(夹)
              data = {
                a: 'make' + (dir.new.isDir ? 'Dir' : 'File'),
                path: me.curPath,
                name: dir.new.name,
              }
            }
          }

          vm.get('./api/webFtp.php', data, (data) => {
            dir.new.isShow = false
            me.$delete(dir.map, dir.new.dirFrom)
            me.$delete(dir.mapSelected, dir.new.dirFrom)
            me.$delete(dir.map, me.curPath)
            me.$delete(dir.mapSelected, me.curPath)
            me.forceOpenDir()
          })
          break
        case '打开':
          console.log('打开')
          break
        case '打开文件夹':
          dir.new.isShow = false
          dir.open.isShow = true
          dir.open.path = ''
          break
        case 'do打开文件夹':
          const path = me.correctPath(me.dir.open.path)
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
          me.dir.open.isShow = 0
          break
        case '批量打开文件夹':
          {
            const dirEl = document.querySelector('.web-ftp .dir.cur')
            const lis = [].slice.call(document.querySelectorAll('.web-ftp .dir.cur li[is-dir=true][draggable=true]'))

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
                  path: me.correctPath(delDir.path + '/' + li.children[1].innerHTML),
                  k: r.dir.zIndex,
                  style: {
                    width: delDir.style.width,
                    height: delDir.style.height,
                    left: pos.left + idx * 26 + 'px',
                    top: pos.top + idx * 26 + 'px',
                    zIndex: r.dir.zIndex,
                  }
                })
              })
            }
          }
          break
        case '全选':
          if (document.activeElement.nodeName.toLowerCase() !== 'input') {
            ;[].slice.call(document.querySelectorAll('.web-ftp .dir.cur .file-list li')).forEach((li) => {
              li.draggable = true
            })
          }
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
            const node = document.querySelector('.web-ftp .dir.cur .path-input')
            node.focus()
            node.select()
          }
          break
        case '删除':
          vm.get('./api/webFtp.php', {
            a: 'fileDelete',
            path: me.curPath,
            names: JSON.stringify(me.getSelectedFiles())
          }, (data) => {
            me.forceOpenDir()
          })
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
        case '显示右键菜单':
          {
            const fixMenu = me.fixMenu
            fixMenu.isShow = true
            fixMenu.style.l = e.clientX
            fixMenu.style.t = e.clientY
            fixMenu.list = []

            if (e.target.closest('[draggable=true]')) {
              fixMenu.list = [
                '打开',
                '复制',
                '剪切',
                '删除',
                '重命名',
                '下载',
              ]
            } else {
              fixMenu.list = [
                '新建文件夹',
                '新建文件',
                '上传文件',
                '上传文件夹',
              ]
            }

            fixMenu.list.push('粘贴')

            me.$nextTick(() => {
              const node = me.$refs.fixMenu
              const pos = node.getBoundingClientRect()

              if (pos.right > window.innerWidth) {
                node.style.left = window.innerWidth - pos.width - 5 + 'px'
              }

              if (pos.bottom > window.innerHeight) {
                node.style.top = window.innerHeight - pos.height - 5 + 'px'
              }
            })
          }
          break
        case '关闭面板':
          vm.isRouterPush = true
          r.dir.list.splice(r.dir.cur, 1)
          !(r.dir.cur >= 0 && r.dir.cur < r.dir.list.length) && (r.dir.cur = 0)
          break
        default:
          console.log('未处理的 action: ', action, e)
          break
      }
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
        if (document.activeElement === e.target) return
        document.activeElement.blur()

        let dirEl = e.target.closest('.dir')
        const grayTitle = e.target.closest('.gray-title')
        const fileList = e.target.closest('.file-list')
        const resize = e.target.closest('.resize')
        const autoScroll = dirEl.querySelector('.auto-scroll')
        const lis = fileList ? [].slice.call(fileList.children).map((li) => {
          return {
            l: li.offsetLeft,
            t: li.offsetTop,
            r: li.offsetLeft + li.offsetWidth,
            b: li.offsetTop + li.offsetHeight,
            ctrlSign: e.ctrlKey ? li.draggable : undefined,
            shiftSign: e.shiftKey ? li.draggable : undefined,
            li,
          }
        }) : []

        const pos = autoScroll.getBoundingClientRect()
        const x1 = e.clientX + webFtpEl.scrollLeft
        const y1 = e.clientY + webFtpEl.scrollTop
        const _x1 = e.clientX + autoScroll.scrollLeft - pos.left
        const _y1 = e.clientY + autoScroll.scrollTop - pos.top
        const originX = dirEl.offsetLeft
        const originY = dirEl.offsetTop
        const originW = dirEl.offsetWidth
        const originH = dirEl.offsetHeight
        let isMoved = false
        let rDir = {}

        me.fixMenu.isShow = false
        r.dir.cur = parseInt(dirEl.getAttribute('dir-idx'))
        rDir = r.dir.list[r.dir.cur]
        rDir.style.zIndex = ++r.dir.zIndex
        document.onmouseup = fnUp

        if (e.target.closest('[draggable=true]')) {
          me.oldLi = e.target.closest('li')
        } else if (['glyphicon-file', 'file-name'].some(v => e.target.classList.contains(v))) {
          fnUp({
            clientX: e.clientX,
            clientY: e.clientY,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            target: e.target,
            which: 1,
          })
          e.target.closest('li').draggable = true
        } else if (grayTitle) {
          startDrag()
        } else if (resize) {
          startResize()
        } else if (fileList) {
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
          const sClass = e.target.className
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
          autoScroll.appendChild(selectRect)
          selectRect.style.width = 
          selectRect.style.height = 0

          document.onmousemove = fnMove
          document.onmouseup = fnUp
        }

        function fnMove(e) {
          const x2 = e.clientX
          const y2 = e.clientY

          const startX = _x1
          const startY = _y1
          const endX = x2 + autoScroll.scrollLeft - pos.left
          const endY = y2 + autoScroll.scrollTop - pos.top

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

          lis.forEach((item) => {
            const li = item.li
            const isColl = !(
              item.l > r ||
              item.r < l ||
              item.t > b ||
              item.b < t
            )
            if (e.ctrlKey) {
              li.draggable = isColl ? !item.ctrlSign : item.ctrlSign
            } else if (e.shiftKey) {
              li.draggable = isColl || item.shiftSign
              isColl && delete item.shiftSign
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

          if (e.clientY > pos.top && e.clientY < pos.bottom) return

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

          switch (e.which) {
            case 1:
              if (isMoved) {
                delete me.oldLi
              } else {
                // 点选
                if (e.ctrlKey) {
                  if (li) {
                    li.draggable = !li.draggable
                    me.oldLi = li
                  }
                } else if (e.shiftKey) {
                  const startLi = me.oldLi || fileList.querySelector('[draggable=true]') || fileList.children[0]
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
                  lis.forEach((item, idx, arr) => {
                    item.li.draggable = false
                  })

                  if (li) {
                    li.draggable = true
                    me.oldLi = li
                  }
                }
              }
              break
            case 2:

              break
            case 3:

              break
          }

          vm.$set(dir.mapSelected, me.curPath, dirEl.querySelectorAll('li[draggable=true]').length)
        }
      }

      dirList.ondblclick = (e) => {
        const li = e.target.closest('li')
        const dirEl = e.target.closest('.dir')

        if (!li) return

        const rDir = r.dir.list[dirEl.getAttribute('dir-idx')]
        vm.isRouterPush = true
        rDir.path = me.correctPath(rDir.path + '/' + me.dir.map[rDir.path][li.getAttribute('data-idx')].name)
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
              me.exec(e, '自动排版')
              break
          }
        } else if (e.shiftKey && e.altKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.ctrlKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'a':
              me.exec(e, '全选')
              break
          }
        } else if (e.shiftKey) {
          switch (vm.keyMap[e.keyCode]) {

          }
        } else if (e.altKey) {
          switch (vm.keyMap[e.keyCode]) {
            case 'd':
              r.dir.list.length > 0 && e.preventDefault()
              me.exec(e, '选中路径')
              break
            case 'n':
              me.exec(e, '新建文件夹')
              break
            case 'o':
              me.exec(e, '打开文件夹')
              break
            case 'w':
              me.exec(e, '关闭面板')
              break
          }
        } else {
          switch (vm.keyMap[e.keyCode]) {
            case 'enter':
              me.exec(e, '批量打开文件夹')
              break
            case 'delete':
              me.exec(e, '删除')
              break
            case 'f2':
              me.exec(e, '重命名')
              break
          }
        }
      }

      document.ondragover = (e) => {
        e.preventDefault()
        const dirEl = e.target.closest('.dir')
        if (!dirEl) return
        r.dir.cur = parseInt(dirEl.getAttribute('dir-idx'))
      }

      document.ondrop = (e) => {
        e.preventDefault()
        me.exec(e, 'do操作文件(夹)')
        dir.new.isFileMove = false
      }
    }
  },
  computed: {
    r() {
      return this.$root.router
    },
    curPath() {
      const me = this
      const vm = me.$root
      const r = vm.router
      
      return (r.dir.list[r.dir.cur] || {}).path || ''
    },
    keyMap() {
      return this.$root.keyMap
    }
  },
  watch: {
    '$root.router.dir.cur'(newVal) {
      const me = this
      const vm = me.$root
      const r = vm.router
      const len = r.dir.list.length
      const cur = r.dir.cur

      if (len === 0) return
      !(cur >= 0 && cur < len) && (r.dir.cur = 0)
    },
    'dir.open.isShow'(newVal) {
      if (!newVal) return
      this.$nextTick(() => {
        const node = document.querySelector('.mask-open-dir .inner .form-control')
        node && node.focus()
      })
    },
    'dir.new.isShow'(newVal) {
      if (!newVal) return
      this.$nextTick(() => {
        const node = document.querySelector('.mask-operate-dir .inner .form-control')
        node && node.focus()
      })
    },
  },
  destroyed() {
    document.onkeydown
    document.ondragover
    document.ondrop = null
  },
  beforeCreate() {
    this.$root.webFtp = this
  },
  mounted() {
    const me = this
    const vm = me.$root
    const r = vm.router

    vm.is.loading = false
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
    position: relative; z-index: 1;
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
            cursor: text;
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