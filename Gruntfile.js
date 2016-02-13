'use strict';

var _ = require('lodash');

module.exports = function (grunt) {
    //load grunt tasks
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //track the time a task takes
    //require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower_concat: {
            all: {
                dependencies: {
                    'angular-material': ['angular', 'angular-animate', 'angular-aria', 'angular-messages']
                },
                callback: function (mainFiles) {
                    return _.map(mainFiles, function (filepath) {
                        //Use minified files if available
                        var min = filepath.replace(/\.js$/, '.min.js');
                        return grunt.file.exists(min) ? min : filepath;
                    });
                },
                dest: 'public/scripts/bower.built.js'
            }
        },

        concat: {
            options: {
                separator: '\n'
            },
            scripts: {
                    src: ['public/app/utils.js', 'public/app/main.js', 'public/app/*/**/*.js'],
                    dest: 'public/scripts/app.built.js'
            },
            css: {
                    src: ['bower_components/angular-material/*.min.css', 'public/css/app.css'],
                    dest: 'public/css/main.css'
            }
        },

        watch: {
            scripts: {
                files: 'public/app/**/*.js',
                tasks: 'concat:scripts'
            },
            css: {
                files: 'sass/*.scss',
                tasks: ['css', 'concat:css']
            }
        }
    });

    grunt.registerTask('default', ['css', 'bower_concat', 'concat']);
    grunt.registerTask('css', function () {
            require('./view/libsass')(this.async());
        }
    );
};