"use strict";

module.exports = (() => {
    let events = {};

    let triggerEvents = (events, args, context) => {
        events.forEach((event) => {
            event.apply(context, args)
        })
    };

    return {
        on: (eventName, callback, isSync) => {
            if (!events[eventName]) {
                events[eventName] = { sync: [], async: [] };
            }
            isSync ? events[eventName].sync.push(callback) : events[eventName].async.push(callback);
        },
        emit: (eventName, args, context) => {
            if (!events[eventName]) {
                return;
            }
            triggerEvents(events[eventName].sync, args, context);
            process.nextTick(() => {
                triggerEvents(events[eventName].async, args, context);
            });
        }
    }
})();