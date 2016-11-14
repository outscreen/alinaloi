'use strict';

const Hapi = require('hapi');
const path = require('path');

const server = new Hapi.Server();
server.connection({port: 8080});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }

    //routes for alinaloi.com
    //TODO refactor to use modules/core/router
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.file('./public/index.html');
        }
    });
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: function (request, reply) {
            let path = request.params.path;
            return reply.file('./public/' + path);
        }
    });
    server.route({
        method: 'GET',
        path: '/files/{path*}',
        handler: function (request, reply) {
            let path = request.params.path;

            return reply.file('./public/files/' + path)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        }
    });

    server.route({
        method: 'OPTIONS',
        path: '/files/{path*}',
        handler: function (request, reply) {
            return reply()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        }
    });

    server.route({
        method: 'GET',
        path: '/asm',
        handler: function (request, reply) {
            let path = request.params.path;
            return reply.file('./public/asm/summary.txt').header("Content-Type", "text/plain; charset=windows-1251");
        }
    });
    server.route({
        method: 'GET',
        path: '/asm/{path*}',
        handler: function (request, reply) {
            let path = request.params.path;
            if (path.length == 1) {
                path = '0' + path;
            }
            path += '.txt';
            return reply.file('./public/asm/' + path).header("Content-Type", "text/plain; charset=windows-1251");
        }
    });

    //require('./modules/core/router')(path.resolve(__dirname,'./modules/web'), server); //init routes
    //require('./modules/core/mongo'); //init routes
});

server.start(() => {
    console.log('Server running at:', server.info.uri);
});