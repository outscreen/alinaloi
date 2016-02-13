(function () {
    'use strict';

    angular.module('alina').constant('ComponentsConfig', {
        main: {
            url: '/',
            templateUrl: 'app/components/main/main.tpl.html',
            abstract: true
        },
        'main.home': {
            title: 'Home',
            url: '',
            templateUrl: 'app/components/home/home.tpl.html',
            controller: 'homeCtrl'
        },
        'main.me': {
            title: 'About me',
            description: 'Some information about me, my skills and work experience',
            img: '/img/menu/about-me.jpg',
            url: 'about',
            templateUrl: 'app/components/me/me.tpl.html'
        },
        'main.links': {
            title: 'Links',
            description: 'A few links I find useful',
            url: 'links',
            img: '/img/menu/useful-links.gif',
            templateUrl: 'app/components/links/links.tpl.html',
            controller: 'linksCtrl'
        },
        'main.contact': {
            title: 'Contact',
            url: 'contact',
            img: '/img/menu/contact.png',
            templateUrl: 'app/components/contact/contact.tpl.html'
        }
    });
})();
