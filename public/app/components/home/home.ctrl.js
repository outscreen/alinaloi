(function () {
    'use strict';

    angular.module('alina').controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', 'menu', '$state'];

    function homeCtrl ($scope, menu, $state) {
/*        //initial config should not be affected by possible object mutations
        this.menuItems = _.cloneDeep(MenuConfig);
        //current state should not be added to circle menu
        delete this.menuItems.home;*/
        this.menuItems = menu;
        this.state = $state.current.name;
        $scope.HomeCtrl = this;
    }
})();
