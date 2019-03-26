<template>
  <div class="web-ftp" ref="webFtpEl">
    <div class="dir-list" ref="dirList">
      <section
        dir-index="0"
        class="dir cur"
        style="left: 200px; top: 100px; width: 400px; height: 400px; z-index: 0;"
      >
        <div class="lmr gray-title">
          <div class="fr">
            <span>7</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove"></i>
          </div>
          <div class="mid path-box">
            <input type="text" value="./upload/demo/fish">
          </div>
        </div>
        <div class="auto-scroll">
          <ul class="file-list">
            <li
              class="file"
              v-for="n in 100"
              :draggable="n == 2"
            >
              <i class="glyphicon glyphicon-file"></i>
              <div class="file-name">avl-random.html</div>
            </li>
          </ul>
          <div class="select-rect" ref="selectRect" style="display: none;"></div>
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
</template>

<script>
export default {
  vmData() {
    const vm = this.$root
    const r = vm.router
    
    return {

    }
  },
  vmMethods() {
    const vm = this.$root
    const r = vm.router
    
    return {

    }
  },
  methods: {
    initEvents() {
      const vm = this.$root
      const r = vm.router
      const webFtpEl = this.$refs.webFtpEl
      const dirList = this.$refs.dirList
      const selectRect = this.$refs.selectRect

      dirList.onmousedown = (e) => {
        const target = e.target
        const dir = target.closest('.dir')
        const fileList = target.closest('.file-list')
        const grayTitle = target.closest('.gray-title')
        const autoScroll = target.closest('.auto-scroll')
        const resize = target.closest('.resize')

        const x1 = e.clientX + webFtpEl.scrollLeft
        const y1 = e.clientY + webFtpEl.scrollTop
        let originX = dir.offsetLeft
        let originY = dir.offsetTop
        let originW = dir.offsetWidth
        let originH = dir.offsetHeight

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
          dir.style.transition = 'none'

          document.onmousemove = (e) => {
            const x2 = e.clientX
            const y2 = e.clientY

            let x = x2 - x1 + originX + webFtpEl.scrollLeft
            let y = y2 - y1 + originY + webFtpEl.scrollTop

            x = x < 0 ? 0 : x
            y = y < 0 ? 0 : y

            dir.style.left = x + 'px'
            dir.style.top = y + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = document.onmouseup = null
            dir.style.transition = ''
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

          dir.style.transition = 'none'

          document.onmousemove = (e) => {
            const o = {}
            const x2 = e.clientX
            const y2 = e.clientY

            const disX = x2 - x1
            const disY = y2 - y1

            o.left = disX +  originX
            o.top = disY +  originY
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
              dir.style[attr] = o[attr] + 'px'
            })
          }

          document.onmouseup = (e) => {
            document.onmousemove = document.onmouseup = null
            dir.style.transition = ''
          }
        }

        function startSelect() {
          const pos = autoScroll.getBoundingClientRect()
          let startX = e.clientX + autoScroll.scrollLeft - pos.left
          let startY = e.clientY + autoScroll.scrollTop - pos.top

          selectRect.style.display = ''

          document.onmousemove = fnMove
          document.onmouseup = fnUp

          function fnMove(e) {
            let endX = e.clientX + autoScroll.scrollLeft - pos.left
            let endY = e.clientY + autoScroll.scrollTop - pos.top

            let x = Math.min(startX, endX)
            let y = Math.min(startY, endY)
            let w = Math.abs(startX - endX)
            let h = Math.abs(startY - endY)

            if (x < 0) {
              w += x
              x = 0
            }

            if (y < 0) {
              h += y
              y = 0
            }

            if (w > autoScroll.scrollWidth - x) {
              w = autoScroll.scrollWidth - x
            }

            if (h > autoScroll.scrollHeight - y) {
              h = autoScroll.scrollHeight - y
            }

            selectRect.style.left = x + 'px'
            selectRect.style.top = y + 'px'
            selectRect.style.width = w + 'px'
            selectRect.style.height = h + 'px'

            clearTimeout(vm.timerDirScroll)

            if (e.clientY > pos.top && e.clientY < pos.bottom) {
              return
            }

            vm.timerDirScroll = setTimeout(() => {
              const isScrollToTop = e.clientY < pos.top
              let dis = isScrollToTop ? e.clientY - pos.top : e.clientY - pos.bottom

              dis /= 10
              dis = dis > 0 ? Math.ceil(dis) : Math.floor(dis)
              autoScroll.scrollTop += dis

              fnMove({
                clientX: e.clientX,
                clientY: e.clientY,
              })
            }, 16)
          }

          function fnUp(e) {
            document.onmousemove = document.onmouseup = null
            dir.style.transition = ''
            selectRect.style.display = 'none'
            clearTimeout(vm.timerDirScroll)
          }
        }
      }
    }
  },
  mounted() {
    const vm = this.$root
    const r = vm.router
    
    this.initEvents()
  }
}
</script>

<style scoped lang="scss">
.web-ftp {
  background: #d3d6d9 !important;
  .dir-list {
    user-select: none;
    .dir {
      width: 300px; height: 300px;
      position: absolute; left: 20px; top: 20px; 
      overflow: hidden; margin-bottom: 5em; background: #fff;
      box-shadow: 0 0 10px rgba(0,0,0,.2); border-radius: 4px;
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
            display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
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
          position: absolute; left: 0; top: 0; z-index: 2;
          background: url(http://codding.cn/blank.php);
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
}
</style>