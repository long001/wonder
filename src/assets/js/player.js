import Hls from 'hls.js'

export default {
  rootMethods: {
    playM3u8() {
      const root = this.$root
      const r = root.router
      const videoUrl = r.videoInfo.m3u8
      
      root.$nextTick(() => {
        const video = document.getElementById('videoPlayer')
        const isSupportM3u8 = root.is.supportM3u8

        if (!video) {
          console.warn('no video')
          return
        }

        if (isSupportM3u8) {
          video.src = videoUrl
          setTimeout(() => {
            video.currentTime = root.mapPlayTime[r.videoInfo.m3u8] || 0
            !root.is.local && video.play()
          }, 10)
        } else if(Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(videoUrl)
          hls.attachMedia(video)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.currentTime = root.mapPlayTime[r.videoInfo.m3u8] || 0
            !root.is.local && video.play()
          })
        } else {
          alert('你的设备不支持播放m3u8')
        }
      })
    }
  }
}