import helpers from 'dom-helpers';

var getLogger = function getLogger(_ref) {
  var enabled = _ref.enabled;
  return function () {
    if (enabled) {
      var _console;

      (_console = console).log.apply(_console, arguments);
    }
  };
};

export var idlePreload = function idlePreload() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$varianceLimit = _ref2.varianceLimit,
      varianceLimit = _ref2$varianceLimit === void 0 ? 5 : _ref2$varianceLimit,
      _ref2$samplingCount = _ref2.samplingCount,
      samplingCount = _ref2$samplingCount === void 0 ? 5 : _ref2$samplingCount,
      _ref2$afterWindowLoad = _ref2.afterWindowLoad,
      afterWindowLoad = _ref2$afterWindowLoad === void 0 ? true : _ref2$afterWindowLoad,
      _ref2$checkTimeInterv = _ref2.checkTimeInterval,
      checkTimeInterval = _ref2$checkTimeInterv === void 0 ? 200 : _ref2$checkTimeInterv,
      _ref2$debug = _ref2.debug,
      debug = _ref2$debug === void 0 ? false : _ref2$debug;

  var log = getLogger({
    enabled: debug
  });
  log('idlePreload start');
  var taskList = [];
  var samplingList = [];

  var startDetect = function startDetect() {
    setTimeout(function () {
      var timeStart = Date.now();
      setTimeout(function () {
        var timeEnd = Date.now();
        var currDelay = timeEnd - timeStart;
        samplingList.push(currDelay);
        log('delay', currDelay);

        if (samplingList.length === samplingCount) {
          var avg = samplingList.reduce(function (total, curr) {
            return total + curr;
          }) / samplingCount;
          var variance = samplingList.reduce(function (total, curr) {
            return Math.pow(curr - avg, 2);
          }, 0) / samplingCount;
          log('variance', variance);

          if (variance < varianceLimit) {
            var task = taskList[0];
            taskList.splice(0, 1);
            task && task();
            log('idlePreload execute task.');

            if (taskList.length === 0) {
              // quit
              log('idlePreload finished');
              return;
            }

            samplingList.splice(0, 1);
          } else {
            samplingList.splice(0, 1);
          }
        }

        startDetect();
      });
    }, checkTimeInterval);
  };

  taskList.start = function () {
    if (afterWindowLoad) {
      var handleLoad = function handleLoad(e) {
        helpers.off(window, 'load', handleLoad);
        startDetect();
      };

      helpers.on(window, 'load', handleLoad);
    } else {
      startDetect();
    }
  };

  var basePush = taskList.push.bind(taskList);

  taskList.push = function () {
    basePush.apply(void 0, arguments);
    return taskList;
  };

  return taskList;
};