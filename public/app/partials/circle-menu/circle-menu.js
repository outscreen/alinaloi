(function () {
    'use strict';

angular.module('alina').directive('circleMenu', circleMenu);

    circleMenuCtrl.$inject = ['$timeout'];

    function circleMenu () {
        return {
            restrict: 'E',
            replace: true,
            controller: circleMenuCtrl,
            controllerAs: 'CircleMenu',
            bindToController: true,
            templateUrl: 'app/partials/circle-menu/circle-menu.tpl.html',
            scope: {
                centerItemDiameter: '@',
                itemDiameter: '@',
                maxWidth: '@',
                items: '=',
                bgColors: '=',
                borderColors: '='
            },
            compile: function () {
                HTMLElement.prototype.CMSetStyle = function (property, value, measure) {
                    var defaultMeasures = {
                        top: 'px',
                        width: 'px',
                        height: 'px',
                        left: 'px',
                        'max-width': 'px',
                        'margin-top': 'px',
                        'margin-left': 'px'
                    };
                    this.style[property] = value + (measure || defaultMeasures[property] || '');
                    //allow chaining
                    return this;
                };

                return function link() {};
            }
        };
    }

    function circleMenuCtrl ($timeout) {
        var self = this;
        var timeOut;

        //set default config
        _.defaults(this, {
            itemDiameter: 150,
            maxWidth: 600,
            interval: 5
        });

        var colorsAmount = this.borderColors && this.borderColors.length || 0;
        var itemsAmount = this.items.length;
        var degree = 360 / itemsAmount;

        /**
         * no way to perform DOM manipulations during compile as we need to know amount of items
         * also some style settings take place only after ng-repeat completes
         */
        var container = document.getElementsByClassName('circle-menu-container')[0].CMSetStyle('max-width', this.maxWidth);
        var containerWidth = container.clientWidth;
        container.CMSetStyle('height', containerWidth);
        var distance = (containerWidth - this.itemDiameter) / 2;

        //set center element position
        var centerEl = document.getElementsByClassName('circle-menu-center')[0];
        var centerElPosition = Math.round(containerWidth / 2);
        centerEl
            .CMSetStyle('height', containerWidth - this.itemDiameter)
            .CMSetStyle('width', containerWidth - this.itemDiameter)
            .CMSetStyle('top', this.itemDiameter / 2)
            .CMSetStyle('left', this.itemDiameter / 2);

        $timeout(function () {
            self.items.forEach(function (value, id) {
                var rotate = id * degree - 90;
                value.element = document.getElementById('circle-menu-item' + id)
                    .CMSetStyle('top', centerElPosition - self.itemDiameter / 2)
                    .CMSetStyle('left', centerElPosition - self.itemDiameter / 2)
                    .CMSetStyle('width', self.itemDiameter)
                    .CMSetStyle('height', self.itemDiameter)
                    .CMSetStyle('transform', 'rotate(' + rotate + 'deg) translate(' + distance + 'px) rotate(' + -1 * rotate + 'deg)')
                    .CMSetStyle('-o-transform', 'rotate(' + rotate + 'deg) translate(' + distance + 'px) rotate(' + -1 * rotate + 'deg)')
                    .CMSetStyle('-ms-transform', 'rotate(' + rotate + 'deg) translate(' + distance + 'px) rotate(' + -1 * rotate + 'deg)')
                    .CMSetStyle('-webkit-transform', 'rotate(' + rotate + 'deg) translate(' + distance + 'px) rotate(' + -1 * rotate + 'deg)')
                    .CMSetStyle('-moz-transform', 'rotate(' + rotate + 'deg) translate(' + distance + 'px) rotate(' + -1 * rotate + 'deg)');

                //set color Id to item
                var i = id % colorsAmount;
                //the last item should not be the same color as the first one
                if ((id === itemsAmount - 1) && i === 0) {
                    i = 1;
                }
                value.colorId = i;
            });
        });

        this.isActive = function (item) {
            return self.activeItem === item;
        };

        this.setActive = function (item) {
            self.activeItem = item;
            if (timeOut) {
                $timeout.cancel(timeOut);
            }
            if (item && item.img) {
                centerEl.CMSetStyle('background-image', 'url(' + item.img + ')');
            } else {
                centerEl.CMSetStyle('background-image', '');
                if (!item) {
                    timeOut = $timeout(toggleActive, this.interval * 1000);
                }
            }
        };

        function toggleActive () {
            var newId = Math.round(Math.random() * (itemsAmount - 1));
            if (self.items[newId] === self.selectedItem) {
                return toggleActive();
            }
            self.setActive(self.items[newId]);
            timeOut = $timeout(toggleActive, self.interval * 1000);
        }

        timeOut = $timeout(toggleActive, this.interval * 1000);
    }
})();