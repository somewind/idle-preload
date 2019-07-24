import helpers from 'dom-helpers'

const getLogger = ({ enabled }) => (...args) => {
  if (enabled) {
    console.log(...args)
  }
}

export const idlePreload = ({
  varianceLimit = 5,
  samplingCount = 5,
  afterWindowLoad = true,
  checkTimeInterval = 200,
  debug = false
} = {}) => {
  const log = getLogger({ enabled: debug })

  log('idlePreload start')

  const taskList = []
  const samplingList = []
  const startDetect = () => {
    setTimeout(() => {
      const timeStart = Date.now()
      setTimeout(() => {
        const timeEnd = Date.now()
        const currDelay = timeEnd - timeStart
        samplingList.push(currDelay)
        log('delay', currDelay)
        if (samplingList.length === samplingCount) {
          const avg = samplingList.reduce((total, curr) => total + curr) / samplingCount
          const variance = samplingList.reduce((total, curr) => (curr - avg) ** 2, 0) / samplingCount
          log('variance', variance)
          if (variance < varianceLimit) {
            const task = taskList[0]
            taskList.splice(0, 1)
            task && task()
            log('idlePreload execute task.')
            if (taskList.length === 0) {
              // quit
              log('idlePreload finished')
              return
            }
            samplingList.splice(0, 1)
          } else {
            samplingList.splice(0, 1)
          }
        }
        startDetect()
      })
    }, checkTimeInterval)
  }

  taskList.start = () => {
    if (afterWindowLoad) {
      const handleLoad = (e) => {
        helpers.off(window, 'load', handleLoad)
        startDetect()
      }
      helpers.on(window, 'load', handleLoad)
    } else {
      startDetect()
    }
  }

  const basePush = taskList.push.bind(taskList)
  taskList.push = (...args) => {
    basePush(...args)
    return taskList
  }

  return taskList
}
