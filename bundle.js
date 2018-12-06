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
        // TODO scale water properly
        _this.waterHeightLimit = 1000;
        _this.water = {
            // represents the scale by which the water image is multiplied
            level: 0.1,
            object: null
        };
        _this.octopus = {
            isReleased: false,
            object: null
        };
        return _this;
    }
    // Phaser scene functions
    GameScene.prototype.preload = function () {
        this.load.image('background_planks', '../assets/background_planks.png');
        this.load.image('platform', '../assets/platform.png');
        this.load.image('water', '../assets/water.png');
        this.load.image('foreground_glass', '../assets/foreground_glass.png');
        this.load.image('aquarium1', '../assets/aquarium_1.png');
        this.load.spritesheet('player', '../assets/player_xd.png', { frameWidth: 152, frameHeight: 89 });
        this.load.image('bubbles', '../assets/bubble_small.png');
        this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
    };
    GameScene.prototype.create = function () {
        // loading game world elements
        this.add.image(400, 300, 'background_planks');
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
        this.platforms.create(600, 510, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(750, 220, 'platform');
        this.aquariums = this.physics.add.staticGroup();
        this.aquariums.create(80, 250 - 32, 'aquarium1');
        // loading game livings
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.octopus.object = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
        this.octopus.object.setBounce(1);
        this.octopus.object.setCollideWorldBounds(true);
        this.octopus.object.disableBody(true, true);
        // loading game world elements
        this.water.object = this.physics.add.staticImage(400, 535, 'water');
        this.water.object.setScale(2, 1);
        this.water.object.setDisplaySize(this.water.object.width, 0);
        this.water.object.alpha = 0.5;
        this.add.image(400, 300, 'foreground_glass');
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
        // animations: particles
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
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.octopus.object, this.platforms);
        this.physics.add.collider(this.octopus.object, this.player);
    };
    GameScene.prototype.update = function () {
        // TODO: try to remove <any>
        var playerInWater = this.physics.world.overlap(this.player, this.water.object);
        // player movement
        if (this.cursors.left.isDown) {
            if (playerInWater) {
                this.player.setVelocityX(-60);
            }
            else {
                this.player.setVelocityX(-160);
            }
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            if (playerInWater) {
                this.player.setVelocityX(60);
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
        // player jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
        else if (this.cursors.up.isDown && playerInWater) {
            this.player.setVelocityY(-60);
        }
        // player bubbles
        if (playerInWater) {
            this.bubblesEmitter.emitParticle();
        }
        // water level change
        if (this.water.object.displayHeight <= this.waterHeightLimit) {
            this.water.level += 1;
            // this.water.object.setScale(2, this.water.level).refreshBody();
            this.water.object.setDisplaySize(this.water.object.width * 2, this.water.level).refreshBody();
        }
        // aquariums release monsters :o
        if (this.physics.world.overlap(this.water.object, this.aquariums) && !this.octopus.isReleased) {
            this.octopus.isReleased = true;
            this.octopus.object.enableBody(true, 80, 250 - 32 - 100, true, true);
            this.octopus.object.setVelocity(50, 20);
        }
        if (this.octopus.object.visible) {
            this.octopus.object.anims.play('life', true);
        }
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;

},{}]},{},[1]);
