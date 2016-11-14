(function () {
    'use strict';

    angular.module('alina').factory('menu', links);

    links.$inject = ['ComponentsConfig'];

    function links(ComponentsConfig) {
        var menu = [];

        _.each(ComponentsConfig, function (component, name) {
            if (component.abstract) {
                return;
            }
            menu.push({
                title: component.title,
                description: component.description,
                img: component.img,
                state: name
            });
        });

        return menu;
    }
})();
