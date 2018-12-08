"use strict";
/// <reference path="../typescript_defs/phaser.d.ts"/>
exports.__esModule = true;
var game_scene_1 = require("./scenes/game-scene");
// Game configuration
var gameConfig = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        "default": 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },
    render: {
        maxLights: 15
    },
    scene: game_scene_1.GameScene
};
var game = new Phaser.Game(gameConfig);
