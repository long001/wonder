export default {
  rootMethods: {
    err(dataOrigin, succ, fail) {
      let data = dataOrigin || ''

      try {
        data = JSON.parse(data)
      } catch (e) {}

      if (data.code) {
        switch (data.code) {
          case '1':
            console.log(data.msg)
            break
          case '2':
            root.alert(data.msg)
            break
          default:
            console.warn('未处理的错误： ', data)
            break
        }

        fail && fail()
      } else {
        succ && succ(data, dataOrigin)
      }
    },
    json2url(o) {
      return Object.keys(o).map((k) => {
        return k + '=' + encodeURIComponent(typeof o[k] === 'object' ? JSON.stringify(o[k]) : o[k])
      }).join('&')
    },
    ajax(o) {
      const root = this.$root
      const xhr = new XMLHttpRequest()
      const method = (o.method || 'GET').toUpperCase()
      const data = o.data || {}
      let url = o.url

      url = /^http/.test(url) ? url : (root.is.local ? root.localUrl + url.replace(/^\.\//, '') : '')

      function fail() {
        o.fail && o.fail(xhr)
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            root.err(xhr.responseText, o.succ, fail)
          } else {
            fail()
          }
        }
      }

      switch (method) {
        case 'GET':
          xhr.open('GET', url + '?' + root.json2url(data), true)
          xhr.send()
          break
        case 'POST':
          xhr.open('POST', url)
          const fm = new FormData()
          Object.keys(data).forEach((k, idx, arr) => {
            fm.append(k, o[k])
          })
          xhr.send(fm)
          break
        default:
          console.error('不支持的method: ' + method)
          break
      }
    },
    get(url, data, succ, fail) {
      this.$root.ajax({
        url, data, succ, fail,
        method: 'GET',
      })
    },
    post(url, data, succ, fail) {
      this.$root.ajax({
        url, data, succ, fail,
        method: 'POST',
      })
    },
    jsonp(url, data, succ, fail) {
      const root = this.$root
      const cbName = data['?']
      const script = document.createElement('script')
      const fnName = data[cbName] = 'jsonp_' + Math.random().toString().replace('0.', '')

      delete data['?']

      window[fnName] = script.onerror = (data = {}) => {
        document.body.removeChild(script)
        delete window[fnName]
        const cb = data.type === 'error' ? fail : succ
        cb && cb(data)
      }

      script.src = url + '?' + root.json2url(data)
      document.body.appendChild(script)
    },
    loadScript(url, succ, error) {
      const script = document.createElement('script')
      script.src = url
      script.onload = script.onerror = (e) => {
        const cb = e.type === 'load' ? succ : error
        e.type === 'error' && (root.is.loading = false)
        cb && cb()
        // document.body.removeChild(script)
      }
      document.body.appendChild(script)
    },
  },
}