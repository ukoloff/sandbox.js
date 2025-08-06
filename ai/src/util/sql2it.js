//
// Make async iterator from SQL stream
//
export default async function* feed(request) {
  let cb
  let events = []
  let suppress = false

  request
    .on('row', handler(1))
    .on('done', handler(0))
    .on('error', handler(-1))
    .stream = true

  while (true) {
    let QQQ = events.length ?
      events.shift()
      :
      await new Promise(init)
    let [status, data] = QQQ
    if (!status)
      break
    if (status < 0) {
      yield Promise.reject(data)
      break
    }
    yield data
  }

  function init(resolve) {
    cb = function (item) {
      cb = 0
      resolve(item)
    }
  }

  function handler(status) {
    return function (data) {
      if (suppress) return
      if (status <= 0) suppress = true
      let item = [status, data]
      if (cb)
        cb(item)
      else
        events.push(item)
    }
  }
}
