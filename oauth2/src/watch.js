const cluster = require('node:cluster');
const tm = require('node:timers/promises')
const c7r = require('chokidar')

var state = 0

c7r.watch(__dirname, { ignoreInitial: true })
  .on('all', tick)

function tick() {
  switch (state) {
    case 0:
      state = 1
      tm.setTimeout(100)
        .then(_ =>  state = 0 )
      for (var w of Object.values(cluster.workers)) {
        w.kill()
      }
    case 1:
  }
}
