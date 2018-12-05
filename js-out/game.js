"use strict";
/// <reference path="../typescript/phaser.d.ts"/>
exports.__esModule = true;
// import 'phaser';
var game_scene_1 = require("./scenes/game-scene");
// Game configuration
var gameConfig = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: {
        "default": 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },
    scene: game_scene_1.GameScene
};
var game = new Phaser.Game(gameConfig);
