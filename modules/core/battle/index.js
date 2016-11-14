"use strict";

const utils = require('../utils');
const config = require('../../config');
const mongo = require('../mongo');

let Battle = function () {
    let activeRobots = [];
    let deadRobots = [];
    let self = this;

    this.id = utils.generateString(config.get('battle.idLength'));

    this.addRobot = function (robot) {
        let amountOfRobots = activeRobots.length;
        if (amountOfRobots >= config.get('battle.maxRobots')) {
            return false;
        }
        activeRobots.push(robot);
        robot.battle = this;
        Battle.allActiveRobots[robot.id] = robot;
        //if we have enough robots, start battle
        if (++amountOfRobots === config.get('battle.minRobots')) {
            this.started = true;
            setRandomDamage();
        }
        return true;
    };

    this.killRobot = function (robot) {
        delete Battle.allActiveRobots[robot.id];
        deadRobots.push(robot);
        activeRobots.splice(activeRobots.indexOf(robot), 1);
        //if we have a winner (or everybody died) save battle to DB and remove from active ones
        if (activeRobots.length <= 1) {
            let winner = activeRobots[0];
            this.saveToDB({ winner: winner });
            winner.saveToDB();
            delete Battle.allActiveRobots[winner.id];
            delete Battle.allActiveBattles[this.id];
            console.log('Battle completed');
        }
    };

    this.selectRandomActiveRobot = function (exclude) {
        let robotsToSelectFrom = activeRobots;
        if (exclude) { //select from robots excluding passed one
            robotsToSelectFrom = [];
            activeRobots.forEach((robot) => {
                if (robot !== exclude) {
                    robotsToSelectFrom.push(robot);
                }
            });
        }
        return robotsToSelectFrom[utils.getRandomInt(0, robotsToSelectFrom.length - 1)];
    };

    function setRandomDamage () {
        //TODO add mechanism to make damage per user request, leave only receive random damage
        self.selectRandomActiveRobot().makeDamage();
        //self.selectRandomActiveRobot().receiveDamage(utils.getRandomInt(0, config.get('battle.maxRandomDamage')));
        //if the battle is still active, make further damage
        if (Battle.allActiveBattles[self.id]) {
            setTimeout(setRandomDamage, config.get('battle.randomDamageInterval') * 1000);
        }
    }

    Battle.activeBattle = this;
    return Battle.allActiveBattles[this.id] = this;
};

Battle.prototype.saveToDB = function (data) {
    mongo.collection('battles').insert(data);
};

Battle.allActiveBattles = {};
Battle.allActiveRobots = {};

module.exports = Battle;