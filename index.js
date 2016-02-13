'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 8080});

server.register(require('inert'), (err) => {
    if (err) {
        throw err;
    }
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
});

server.start(() => {
    console.log('Server running at:', server.info.uri);
});