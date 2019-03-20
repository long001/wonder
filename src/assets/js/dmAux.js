!location.origin && (location.origin = location.href.split('/').filter((_, idx) => {
  return idx < 3
}).join('/'))

!Array.prototype.fill && (Array.prototype.fill = function(fillBy, from, to) {
  from = from === undefined ? 0 : from
  to = to === undefined ? this.length : to

  for (let i = from; i < to; i++) {
    this[i] = fillBy
  }

  return this
})

Date.prototype.format = function(format) {
  const o = {
    y: this.getFullYear(),
    m: (this.getMonth() + 1),
    d: this.getDate(),
    h: this.getHours(),
    i: this.getMinutes(),
    s: this.getSeconds(),
  }

  return (format || 'y-m-d h:i:s').replace(/y|m|d|h|i|s/g, (k) => {
    let str = o[k].toString()
    return str.length < 2 ? '0' + str : str
  })
}