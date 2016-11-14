(function () {
    'use strict';

angular.module('alina').directive('horizontalMenu', horizontalMenu);

    horizontalMenuCtrl.$inject = ['menu', '$state'];

    function horizontalMenu () {
        return {
            restrict: 'E',
            replace: true,
            controller: horizontalMenuCtrl,
            controllerAs: 'HorizontalMenu',
            bindToController: true,
            templateUrl: 'app/partials/horizontal-menu/horizontal-menu.tpl.html',
            scope: true
        };
    }

    function horizontalMenuCtrl (menu, $state) {
        this.menuItems = menu;
        this.getState = function () {
            return $state.current.name;
        }
    }
})();