/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

const
    util       = require('util'),
    colors     = require('colors/safe'),
    dateConfig = {hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'},
    logger     = {};


function time () {
    const date = new Date();

    return date.toLocaleString('en', dateConfig) + '.' + (+date).toString().substr(-3);
}


// export colorization
logger.colors = colors;


logger.info = function () {
    console.log(colors.grey(time()), util.format.apply(util, arguments));
};

logger.warn = function () {
    console.log(colors.bgYellow.black(time()), util.format.apply(util, arguments));
};

logger.fail = function () {
    console.log(colors.bgRed(time()), util.format.apply(util, arguments));
};

logger.inspect = function ( data ) {
    util.inspect(data, {colors: true, depth: 5}).split('\n').forEach(function ( line ) {
        logger.info(line);
    });
};


// add individual report methods for a task
logger.wrap = function ( title ) {
    const result = {
        // export colorization
        colors: colors,

        // configurable task message
        format: '[%s] %s',

        // task name
        title: colors.cyan(title),

        info: function () {
            logger.info(result.format, result.title, util.format.apply(util, arguments));
        },

        warn: function () {
            logger.warn(result.format, result.title, util.format.apply(util, arguments));
        },

        fail: function () {
            logger.fail(result.format, result.title, util.format.apply(util, arguments));
        },

        inspect: function ( data ) {
            util.inspect(data, {colors: true, depth: 5}).split('\n').forEach(function ( line ) {
                result.info(line);
            });
        }
    };

    return result;
};


// public
module.exports = logger;
