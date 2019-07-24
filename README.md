# Idle Preload

## Features

Preload something when the system is idle.

## Installation

```shell
yarn add idle-preload
```

or

```shell
npm i idle-preload --save
```

## Usage

```js
import { idlePreload } from 'idle-preload'

const preload = idlePreload({
  // options
  // debug: true
})
preload.push(() => {
  // use your code to preload something
  // 
})
preload.start()
```

## Options

* `varianceLimit: Integer` (default **5**),
* `samplingCount: Integer` (default **5**),
* `afterWindowLoad: Boolean` (default **true**),
* `checkTimeInterval: Integer` (default **200**) ms,
* `debug: Boolean` (default **false**)

## License

[MIT](./LICENSE)
