(function () {
    'use strict';

    angular.module('alina').constant('LinksConfig', {
        tags: {
            angular: 'AngularJS',
            node: 'Node.js',
            other: 'Other'
        },
        links: [
            {
                title: 'Popular AngularJS modules',
                url: 'http://ngmodules.org/',
                tags: ['angular']
            },
            {
                title: 'Change view animations with examples',
                url: 'http://dfsq.github.io/ngView-animation-effects/app/#/page/1',
                tags: ['angular']
            },
            {
                title: 'Markdown Cheatsheet',
                url: 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'
            }, {
                title: 'Hapi.js request lifecycle',
                url: 'http://freecontent.manning.com/hapi-js-in-action-diagram/',
                tags: ['node']
            }
        ]
    });
})();
