(function () {
    'use strict';

    angular.module('alina').controller('contactCtrl', contactCtrl);

    contactCtrl.$inject = ['$scope', '$timeout'];

    function contactCtrl ($scope, $timeout) {
        function formToConsole() {
            console.log('console.log($scope.contactForm): ', $scope.contactForm);
        }

        formToConsole();

        console.log('After all inited: ');
        $timeout(formToConsole);
    }
})();
