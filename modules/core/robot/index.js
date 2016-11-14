"use strict";
const utils = require('../utils');
const config = require('../../config');
const mongo = require('../mongo');

let Robot = function (passedName, data = {}) {
    let hp = data.hp || utils.getRandomInt(config.get('robot.minHp'), config.get('robot.maxHp'));
    let damage = data.damage || utils.getRandomInt(config.get('robot.minDamage'), config.get('robot.maxDamage'));
    let name = data.name || passedName;
    let receivedDamage = data.receivedDamage || 0;
    let madeDamage = data.madeDamage || 0;
    let missed = data.missed || 0;

    this.id = data.id || utils.generateString(config.get('robot.idLength'));

    this.makeDamage = function () {
        let damageAmount = utils.getRandomInt(0, damage);
        if (!damageAmount) {
            missed++;
            return;
        }
        madeDamage += damageAmount;
        this.battle.selectRandomActiveRobot(this).receiveDamage(damageAmount);
        return damageAmount;
    };

    this.receiveDamage = function (damageAmount) {
        receivedDamage += damageAmount;
        if (receivedDamage >= hp) {
            this.isDead = true;
            this.saveToDB();
            this.battle.killRobot(this);
        }
    };

    this.getInfo = function () {
        return { name, missed, madeDamage, receivedDamage, hp, currentHp: hp - receivedDamage }
    };

    return this;
};

Robot.prototype.saveToDB = function () {
    mongo.collection('robots').insert({ id: this.id, info: this.getInfo() });
};

module.exports = Robot;