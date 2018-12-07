(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="../typescript_defs/phaser.d.ts"/>
exports.__esModule = true;
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

},{"./scenes/game-scene":2}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, {
            key: "GameScene"
        }) || this;
        // Game settings
        _this.gameWorldWidth = 2080;
        _this.gameWorldHeight = 1280;
        _this.gameWorldCenterX = _this.gameWorldWidth / 2;
        _this.gameWorldCenterY = _this.gameWorldHeight / 2;
        _this.groundHeight = 4 * 32;
        _this.waterHeightLimit = _this.gameWorldHeight - _this.groundHeight - 100;
        return _this;
    }
    // Phaser scene functions
    GameScene.prototype.preload = function () {
        this.load.image("tiles", "../assets/world_tails.png");
        this.load.tilemapTiledJSON("map", "../assets/game_map.json");
        this.load.image('background_planks', '../assets/background_planks.png');
        this.load.image('aquarium1', '../assets/aquarium_1.png');
        this.load.image('bubbles', '../assets/bubble_small.png');
        this.load.image('water', '../assets/water.png');
        this.load.image('foreground_glass', '../assets/foreground_glass.png');
        this.load.spritesheet('player', '../assets/player_xd.png', { frameWidth: 152, frameHeight: 89 });
        this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
    };
    GameScene.prototype.create = function () {
        // loading game world elements
        this.add.tileSprite(this.gameWorldCenterX, this.gameWorldCenterY, this.gameWorldWidth, this.gameWorldHeight, 'background_planks');
        // loading game map
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("world_tails", "tiles");
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0);
        this.aquariums = this.physics.add.staticGroup();
        this.aquariums.create(80, 250 - 32, 'aquarium1');
        // loading game livings
        this.player = this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.octopus = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
        this.octopus.setBounce(1);
        this.octopus.setCollideWorldBounds(true);
        this.octopus.disableBody(true, true);
        // loading game world elements
        this.water = this.physics.add.staticImage(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight, 'water');
        this.water.setDisplaySize(this.gameWorldWidth, 0);
        this.water.alpha = 0.5;
        this.add.image(this.gameWorldCenterX, this.gameWorldCenterY, 'foreground_glass').setDisplaySize(2040, 1280);
        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        // animations
        this.anims.create({
            key: 'left',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 1 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: [{ key: 'player', frame: 2 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'life',
            frames: this.anims.generateFrameNumbers('octopus', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        // animations -> particles
        var bubblesEmitterManager = this.add.particles('bubbles');
        this.bubblesEmitter = bubblesEmitterManager.createEmitter({
            speed: 60,
            scale: { start: 1, end: 0 },
            maxParticles: 10,
            accelerationY: -400
        });
        this.bubblesEmitter.startFollow(this.player);
        this.bubblesEmitter.stop();
        // collisions
        this.physics.world.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.collider(this.octopus, this.worldLayer);
        this.physics.add.collider(this.octopus, this.player);
        // camera
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
    };
    GameScene.prototype.update = function () {
        var playerInWater = this.physics.world.overlap(this.player, this.water);
        // player movement
        if (this.cursors.left.isDown) {
            if (playerInWater) {
                this.player.setVelocityX(-600);
            }
            else {
                this.player.setVelocityX(-160);
            }
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            if (playerInWater) {
                this.player.setVelocityX(600);
            }
            else {
                this.player.setVelocityX(160);
            }
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        // player movement -> player jump
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);
        }
        else if (this.cursors.up.isDown && playerInWater) {
            this.player.setVelocityY(-600);
        }
        // player bubbles
        if (playerInWater) {
            this.bubblesEmitter.emitParticle();
        }
        // water level change
        if (this.water.displayHeight <= this.waterHeightLimit) {
            this.water.setDisplaySize(this.water.displayWidth, this.water.displayHeight + 1).refreshBody();
            this.water.setPosition(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight - (this.water.displayHeight / 2));
        }
        // aquariums release monsters :o
        if (this.physics.world.overlap(this.water, this.aquariums) && !this.octopus.body.enable) {
            this.octopus.enableBody(true, 80, 250 - 32 - 100, true, true);
            this.octopus.setVelocity(50, 20);
        }
        if (this.octopus.body.enable) {
            this.octopus.anims.play('life', true);
        }
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;

},{}]},{},[1]);
