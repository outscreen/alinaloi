(function () {
    "use strict";

    HTMLElement.prototype.scrollTo = function (duration) {
        var self = this;
        duration = duration || 0;
        if (duration <= 0) return;
        if (!this.scrollTop) return;
        var scrollAtOnce = Math.round(this.scrollTop / duration * 10)

        setTimeout(function () {
            var newPosition = self.scrollTop - scrollAtOnce;
            self.scrollTop = newPosition > 0 ? newPosition : 0;
            self.scrollTo(duration - 10);
        }, 10);
    };
})();
