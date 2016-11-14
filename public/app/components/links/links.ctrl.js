(function () {
    'use strict';

    angular.module('alina').controller('linksCtrl', linksCtrl);

    linksCtrl.$inject = ['$scope', 'LinksConfig', 'links', '$window'];

    function linksCtrl ($scope, LinksConfig, links, $window) {
        this.tags = LinksConfig.tags;
        this.links = links;
        this.open = function (link, event) {
            event.stopPropagation();
            $window.open(link, '_blank');
        };
        $scope.LinksCtrl = this;
    }
})();
