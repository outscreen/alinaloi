"use strict";

const Battle = require('../../../core/battle');
const Robot = require('../../../core/robot');
const mongo = require('../../../core/mongo');

module.exports.reloadScript = '<script>setTimeout(function () {location.href=location.href}, 5 * 1000)</script>';
module.exports.promtNameScript = '<script>var name = prompt("Please enter robot\'s name:"); location.search = "?name=" + name;</script>';

module.exports.createNewRobot = function (name) {
    let robot = new Robot(name);
    //if there is no active battle or it is not possible to add the robot to current one, create new battle
    if (!Battle.activeBattle || !Battle.activeBattle.addRobot(robot)) {
        let battle = new Battle();
        battle.addRobot(robot);
    }
    return robot;
};

module.exports.findRobot = function (id) {
    return new Promise((resolve, reject) => {
        if (Battle.allActiveRobots[id]) {
            return resolve(Battle.allActiveRobots[id]);
        }
        mongo.collection('robots').find({ id: id }).limit(1).toArray(function (err, data) {
            if (err || !data[0]) {
                return reject();
            }
            resolve({
                result: data[0].info.currentHp > 0 ? 'you won' : 'you lost',
                robot: data[0].info
            });
        });
    });
};