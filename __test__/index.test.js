const { idlePreload } = require('../lib')

test('idlePreload execute task', (done) => {
  const preload = idlePreload({
    afterWindowLoad: false
  })
  let i = 0
  preload.push(() => {
    i++
  })
  preload.push(() => {
    i++
  })
  preload.push(() => {
    expect(i).toBe(2)
    done()
  })
  preload.start()
})
