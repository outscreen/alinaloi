"use strict";

const _ = require('lodash');
const mongo = require('../mongo');
const mediator = require('../mediator');
const config = require('../../config');
const utils = require('../utils');

let sessionName = config.get('session.cookieName');
let defaultSession = {};
let cache = {}; //TODO add caching

let Session = function () {
    let _store;
    let _set = {};
    let _unset = {};

    this.init = (request) => {
        return new Promise((resolve, reject) => {
            mongo.collection('sessions')
            .find(
                {key: request.state[sessionName]},
                {_id: 0, key: 0}
            )
            .limit(1)
            .toArray((err, data) => {
                if (err) {
                    return reject(this);
                }
                //console.log(data)
                data = data[0];
                _store = data || _.cloneDeep(defaultSession);
                if (!data) {
                    _set = _.cloneDeep(defaultSession);
                }
                return resolve(this);
            });
        });
    };

    this.get = (key) => {
        return _.get(_store, key);
    };

    this.delete = (key) => {
        _unset[key] = '';
        delete _set[key];
        return _.unset(_store, key);
    };

    this.set = (key, value) => {
        _set[key] = value;
        delete _unset[key];
        return _.set(_store, key, value);
    };

    this.getSetKeys = () => { return Object.keys(_set).length ? _set : null; };
    this.getDeletedKeys = () => { return Object.keys(_unset).length ? _unset : null; };

    return this;
};

mediator.on('pre-reply', (request, reply, replyObj) => {
    let sessionKey = request.state[sessionName];
    let update = {};
    let setKeys = request.session.getSetKeys();
    let deletedKeys = request.session.getDeletedKeys();

    if (!sessionKey) {
        //if not present, generate random string
        let sessionKey = utils.generateString(config.get('session.length'));
        replyObj.state(sessionName, sessionKey);
        setKeys = setKeys || {};
        setKeys.key = sessionKey;
    }

    setKeys && (update.$set = setKeys);
    deletedKeys && (update.$unset = deletedKeys);

    if (setKeys || deletedKeys) {
        mongo.collection('sessions').update({ key: sessionKey }, update, { upsert: true }, function (err) {
            if (err) {
                console.log('Set session error: ', err);
            }
        });
    }
}, true);

module.exports = (request) => {
    return new Session(request);
};


