Task runner logger
==================

[![build status](https://img.shields.io/travis/runner/logger.svg?style=flat-square)](https://travis-ci.org/runner/logger)
[![npm version](https://img.shields.io/npm/v/runner-logger.svg?style=flat-square)](https://www.npmjs.com/package/runner-logger)
[![dependencies status](https://img.shields.io/david/runner/logger.svg?style=flat-square)](https://david-dm.org/runner/logger)
[![devDependencies status](https://img.shields.io/david/dev/runner/logger.svg?style=flat-square)](https://david-dm.org/runner/logger?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/runner-logger)


## Installation ##

```bash
npm install runner-logger
```


## Usage ##

Add to the scope:

```js
const logger = require('runner-logger');
```

General output with different colors:

```js
// 16:25:30.811 simple line
logger.info('simple line');

// 16:25:30.811 warning message
logger.warn('warning message');

// 16:25:30.811 error
logger.fail('error');

// print some complex data
logger.inspect(someObject);
```

Access [colors](https://www.npmjs.com/package/colors) instance:

```js
const colors = logger.colors;

logger.info(
    colors.black.bgYellow('black text on yellow background')
);
```

Some task specific output:

```js
const log = logger.wrap('webpack');

// 16:25:30.811 [webpack] build is ok
log.info('build is ok');
```


## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/logger/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`runner-logger` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
