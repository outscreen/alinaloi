"use strict";

const randomstring = require('randomstring');
const Battle = require('../../../core/battle');
const Robot = require('../../../core/robot');
const battleService = require('./battle');

module.exports.joinBattle = function (request, reply) {
    let robotId = request.session.get('robot');
    let name = request.query.name;
    let robot;

    function createNewRobot () {
        if (!name) {
            return reply(battleService.promtNameScript);
        }
        robot = battleService.createNewRobot(name);
        request.session.set('robot', robot.id);
        replyWithRobotInfo(robot);
    }

    function replyWithRobotInfo (robot) {
        let response = robot.getInfo();
        response.battleStarted = robot.battle.started;
        return reply(battleService.reloadScript + JSON.stringify(response));
    }

    if (!robotId) {
        return createNewRobot();
    }

    battleService.findRobot(robotId).then(
        (robot) => {
            if (robot.result) {
                return reply(JSON.stringify(robot));
            }
            return replyWithRobotInfo(robot);
        },
        createNewRobot)
};