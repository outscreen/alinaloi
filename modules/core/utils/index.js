"use strict";

const randomstring = require('randomstring');

var Utils = {};

Utils.getRandomInt = function (from, to) {
    return Math.round(Utils.getRandom(from, to));
};

Utils.getRandom = function (from, to) {
    return Math.random() * (to - from) + from;
};

Utils.generateString = function (len) {
    //add timestamp to ensure it is unique
    return randomstring.generate(len) + +Date.now();
};

module.exports = Utils;