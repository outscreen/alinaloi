(function () {
    'use strict';

    angular.module('alina').factory('links', links);

    links.$inject = ['LinksConfig'];

    function links(LinksConfig) {
        var links = {};

        _.each(LinksConfig.links, function (link) {
            link.hostname = link.hostname || getHostname(link);
            if (!link.tags || !link.tags.length) {
                links.other = links.other || [];
                links.other.push(link);
            } else {
                _.each(link.tags, function (tag) {
                    links[tag] = links[tag] || [];
                    links[tag].push(link);
                });
            }
        });

        function getHostname (link) {
            return link.url.replace(/https*:\/\//,"").replace(/\/.*/, '');
        }

        return links;
    }
})();
