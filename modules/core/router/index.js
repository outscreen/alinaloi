"use strict";
const fs = require('fs');
const _ = require('lodash');
const mediator = require('../mediator');
const session = require('../session');
const Promise = require('bluebird');

//TODO add alinaloi.com routes
module.exports = function (pathToWeb, server) {
    let pathToRobots = pathToWeb + '/robots/';
    let dirs = fs.readdirSync(pathToRobots);
    dirs.forEach((dir) => {
        let routes = require(pathToRobots + dir + '/route.json');
        let handlers = require(pathToRobots + dir + '/controller');
        _.forOwn(routes, (route) => {
            server.route({
                method: route.method,
                path: '/robots' + (route.isAbsolute ? route.path : '/' + dir + route.path),
                handler: Promise.coroutine(function* (request, reply) {
                    //mediator.emit('pre-request', [request, reply]);
                    if (route.session) {
                        request.session = yield session().init(request)
                    }
                    let replyFunc = (response) => {
                        let replyObj = reply(response);
                        mediator.emit('pre-reply', [request, reply, replyObj]);
                        return replyObj;
                    };
                    replyFunc.__proto__ = Object.create(reply.__proto__);
                    handlers[route.controller](request, replyFunc);
                })
            });
        });
    });
};
