(function () {
    'use strict';
    angular.module('alina').config(router);

    router.$inject = ['$stateProvider', '$urlRouterProvider', 'ComponentsConfig'];

    function router ($stateProvider, $urlRouterProvider, ComponentsConfig) {
        $urlRouterProvider.otherwise("/");

        angular.forEach(ComponentsConfig, function (config, name) {
            $stateProvider.state(name, {
                url: config.url,
                views: config.views,
                templateUrl: config.templateUrl,
                controller: config.controller,
                abstract: config.abstract
            });
        });
    }
})();