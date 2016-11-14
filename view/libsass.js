'use strict';

var sass = require('node-sass');
var fs = require('fs');
var debug = require('debug')('libsass');

module.exports = function (done) {
    var from = process.cwd() + '/sass/app.scss';
    var to = process.cwd() + '/public/css/app.css';
    var dir = process.cwd() + '/public/css';

    sass.render({
        file: from
    }, function (err, res) {
        if (err) {
            debug(err);
            return console.log(err);
        }

        //if target dir not yet exists, create it first
        fs.exists(dir, function (exists) {
            if (!exists) {
                fs.mkdir(dir, function (err) {
                    if (err) {
                        debug('css NOT compiled ' + err);
                        return console.log(err);
                    }
                    writeFile();
                });
            } else {
                writeFile();
            }
        });

        /**
         * Write result file to needed dir
         */
        function writeFile() {
            fs.writeFile(to, res.css.toString(), function (err) {
                if (err) {
                    debug('css NOT compiled ' + err);
                    return console.log(err);
                }
                debug('css COMPILED');
                done();
            });
        }
    });
};