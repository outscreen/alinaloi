(function () {
    'use strict';

    angular.module('alina', [
        'ui.router',
        'ngMaterial'
    ]);

    angular.module('alina')
        .run(runModule);

    runModule.$inject = ['$rootScope', '$state', 'mobileWidth'];

    function runModule($rootScope, $state, mobileWidth) {
        var wrapper = document.getElementsByClassName('wrapper')[0];
        $rootScope.go = $state.transitionTo;
        $rootScope.isMobileWidth = document.body.clientWidth <= mobileWidth;
        $rootScope.$on("$stateChangeStart", function () {
            wrapper.scrollTo(300);
        });
    }
})();