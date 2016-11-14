"use strict";

const config = require('./config.json');
const _ = require('lodash');

module.exports.get = function (path) {
    //return _.has(config, path) ? _.get(config, path) : undefined;
    return _.get(config, path);
};