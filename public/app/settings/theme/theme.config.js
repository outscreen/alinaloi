(function () {
    'use strict';

    angular.module('alina')
        .constant('mobileWidth', 750)
        .constant('BorderColors', [
            'border-color1',
            'border-color2',
            'border-color3'
        ])
        .constant('BgColors', [
            'background-color1',
            'background-color2',
            'background-color3'
        ])
        .config(mdTheme);

    mdTheme.$inject = ['$mdThemingProvider'];

    function mdTheme($mdThemingProvider) {
        $mdThemingProvider.theme('default')
         .primaryPalette('deep-orange')
         .backgroundPalette('orange')
         .accentPalette('orange');
    }
})();