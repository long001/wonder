<template>
  <div class="web-ftp">
    <div class="dir-list">
      <section dir-index="0" class="dir cur" style="left: 100px; top: 100px; width: 400px; height: 400px; z-index: 0;">
        <div class="lmr gray-title">
          <div class="fr">
            <span>7</span>
            <i class="glyphicon glyphicon-pencil"></i>
            <i class="glyphicon glyphicon-remove"></i>
          </div>
          <div class="mid path-box">
            <input type="text">
          </div>
        </div>
        <div class="auto-scroll">
          <ul class="file-list">
            <li class="file">
              <i class="glyphicon glyphicon-file"></i>
              <div class="file-name">avl-random.html</div>
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
}
</script>

<style scoped lang="scss">
.web-ftp {
  background: #d3d6d9 !important;
  .dir-list {
    .dir {
      width: 300px; height: 300px; position: absolute; left: 20px; top: 20px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,.2); border-radius: 4px; overflow: hidden; transition: .3s all; margin-bottom: 5em;
      .gray-title {
        cursor: move;
        input {
          cursor: inherit;
          outline: none; text-indent: 8px;
          border: 1px solid #ccc;
          height: 24px; line-height: 24px;
          width: 100%;
        }
      }
      .auto-scroll {
        position: absolute; left: 0; top: 34px; right: 0; bottom: 0; overflow: auto; z-index: 1;
        .file-list {
          text-align: center; word-break: break-all; padding-bottom: 5em; overflow: hidden; margin-bottom: 0; min-height: 100%; padding-right: 5px;
          .file {width: 75px; height: 75px; float: left; margin: 5px 0 0 5px; padding-top: .4em; border: 1px solid transparent;}
          .file:hover {background: rgb(229,243,255);}
          .file:active {background: rgb(216,234,255);}
          .file[draggable=true] {background: #ddd; border-color: #ccc;}
          .file .glyphicon {font-size: 28px; cursor: inherit;}
          .file[is-dir=true] .glyphicon:before {color: #fd5;}
          .file .file-name {line-height: 1.4em; max-height: 2.8em; font-size: 12px; overflow: hidden; padding: 0 .2em; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;}
        }
      }
      .cur .auto-scroll .file-list .file[draggable=true] {background: rgb(204,232,255); border-color: rgb(153,209,255);}
      .dragover {background: #f3f6f9;}
      .auto-scroll .file-list .file.cut {opacity: .75;}

      .resize {
        & > div > div {width: 6px; height: 6px; position: absolute; left: 0; top: 0; background: url(http://codding.cn/blank.php); z-index: 2;}
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
}
</style>