(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var Aquarium = /** @class */ (function (_super) {
    __extends(Aquarium, _super);
    function Aquarium(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.sys.updateList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.STATIC_BODY);
        return _this;
    }
    Aquarium.prototype.setWater = function (water) {
        this.water = water;
    };
    Aquarium.prototype.setOctopus = function (octopus) {
        this.octopus = octopus;
    };
    Aquarium.prototype.update = function (time, delta) {
        _super.prototype.update.call(this, time, delta);
        if (this.water != null && this.octopus != null) {
            if (this.scene.physics.world.overlap(this.water, this)
                && !this.octopus.body.enable) {
                this.octopus.release(this.x, this.y);
                this.disableBody(true, true);
            }
        }
    };
    return Aquarium;
}(Phaser.Physics.Arcade.Sprite));
exports.Aquarium = Aquarium;

},{}],2:[function(require,module,exports){
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
var Octopus = /** @class */ (function (_super) {
    __extends(Octopus, _super);
    function Octopus(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        _this.growSpeedFactor = 500;
        _this.changeDirectorPeriod = 2000;
        _this.minLightStickDistance = 250;
        _this.minPlayerChaseDistance = 500;
        _this.defaultVelocity = 10;
        _this.lastChangedDirectionTime = 0;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.sys.updateList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        _this.disableBody(true, true);
        return _this;
    }
    Octopus.prototype.update = function (time, delta) {
        var _this = this;
        _super.prototype.update.call(this, time, delta);
        if (this.released) {
            this.anims.play('life', true);
            if (this.scaleX < 1.0) {
                this.setScale(this.scaleX + delta / this.growSpeedFactor, this.scaleY + delta / this.growSpeedFactor);
                return;
            }
            var playerDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y);
            // try catch player
            var playerCaught = this.scene.physics.world.overlap(this.player, this);
            if (playerCaught) {
                if (this.onPlayerCaughtCallback) {
                    this.onPlayerCaughtCallback();
                }
            }
            // run away from light sticks
            var runned_1 = false;
            this.lightSticks.forEach(function (lightStick) {
                var distance = Phaser.Math.Distance.Between(lightStick.x, lightStick.y, _this.x, _this.y);
                if (distance < _this.minLightStickDistance) {
                    runned_1 = true;
                    var angle = Phaser.Math.Angle.Between(lightStick.x, lightStick.y, _this.x, _this.y);
                    _this.setWalkingAngle(angle);
                }
            }, this);
            if (runned_1) {
                return;
            }
            // chase the player
            if (playerDistance < this.minPlayerChaseDistance) {
                var angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                this.setWalkingAngle(angle);
                return;
            }
            // bounce from obstacles
            if (this.body.blocked.left) {
                this.setWalkingAngle(0 * Math.PI / 2);
            }
            else if (this.body.blocked.right) {
                this.setWalkingAngle(2 * Math.PI / 2);
            }
            else if (this.body.blocked.up) {
                this.setWalkingAngle(1 * Math.PI / 2);
            }
            else if (this.body.blocked.down) {
                this.setWalkingAngle(3 * Math.PI / 2);
            }
            else if (time > this.lastChangedDirectionTime + this.changeDirectorPeriod) {
                this.lastChangedDirectionTime = time;
                this.setRandomWalkingAngle();
            }
        }
    };
    Octopus.prototype.release = function (x, y) {
        this.enableBody(true, x, y, true, true);
        this.setScale(0.1, 0.1);
        this.released = true;
    };
    Octopus.prototype.setDefaultVelocity = function (v) {
        this.defaultVelocity = v;
    };
    Octopus.prototype.setLightSticks = function (lightSticks) {
        this.lightSticks = lightSticks;
    };
    Octopus.prototype.setPlayer = function (player) {
        this.player = player;
    };
    Octopus.prototype.onPlayerCaught = function (callback) {
        this.onPlayerCaughtCallback = callback;
    };
    Octopus.prototype.setRandomWalkingAngle = function () {
        this.setWalkingAngle(Phaser.Math.FloatBetween(0, 2 * Math.PI));
    };
    Octopus.prototype.setWalkingAngle = function (radians) {
        this.setVelocity(this.defaultVelocity * Math.cos(radians), this.defaultVelocity * Math.sin(radians));
    };
    return Octopus;
}(Phaser.Physics.Arcade.Sprite));
exports.Octopus = Octopus;

},{}],3:[function(require,module,exports){
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

},{"./scenes/game-scene":4}],4:[function(require,module,exports){
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
var Octopus_1 = require("../Octopus");
var Aquarium_1 = require("../Aquarium");
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
        _this.lightSticks = [];
        return _this;
    }
    // Phaser scene functions
    GameScene.prototype.preload = function () {
        this.load.image("tiles", ["../assets/world_tails.png", "../assets/world_tails_n.png"]);
        this.load.tilemapTiledJSON("map", "../assets/game_map.json");
        this.load.image('background_planks', ['../assets/background_planks.png', '../assets/background_planks_n.png']);
        this.load.image('aquarium1', ['../assets/aquarium_1.png', '../assets/aquarium_1_n.png']);
        this.load.image('bubbles', '../assets/bubble_small.png');
        this.load.image('lightstick', '../assets/lightstick.png');
        this.load.image('water', ['../assets/water.png', '../assets/water_n.png']);
        this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
        //this.load.spritesheet('player', ['../assets/player_xd.png', '../assets/player_xd_n.png'], { frameWidth: 152, frameHeight: 89 });
        this.load.spritesheet({
            key: 'player',
            url: '../assets/player_xd.png',
            normalMap: '../assets/player_xd_n.png',
            frameConfig: {
                frameWidth: 152,
                frameHeight: 89
            }
        });
        this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
    };
    GameScene.prototype.create = function () {
        var _this = this;
        // light
        this.lights.enable().setAmbientColor(0x000000);
        this.playerLight = this.lights.addLight(this.gameWorldCenterX, this.gameWorldCenterY, 200).setIntensity(0.5);
        this.octopusLight = this.lights.addLight(this.gameWorldCenterX, this.gameWorldCenterY, 150).setIntensity(0.5);
        // loading game world elements
        this.add.tileSprite(this.gameWorldCenterX, this.gameWorldCenterY, this.gameWorldWidth, this.gameWorldHeight, 'background_planks')
            .setPipeline('Light2D');
        // loading game map
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("world_tails", "tiles");
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');
        // loading game livings
        this.player = this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        //this.player.setPipeline('Light2D');
        this.octopus = new Octopus_1.Octopus(this, 0, 0, 'octopus');
        this.octopus.setBounce(0);
        this.octopus.setCollideWorldBounds(true);
        this.octopus.setDefaultVelocity(300);
        this.octopus.setLightSticks(this.lightSticks);
        this.octopus.setPlayer(this.player);
        this.octopus.body.allowGravity = false;
        this.octopus.onPlayerCaught(function () { return _this.playerCaught(); });
        // loading game world elements
        this.water = this.physics.add.staticImage(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight, 'water');
        this.water.setDisplaySize(this.gameWorldWidth, 0);
        this.water.alpha = 0.5;
        this.water.setPipeline('Light2D');
        this.aquarium = new Aquarium_1.Aquarium(this, 1030, 800, 'aquarium1');
        this.aquarium.setPipeline('Light2D');
        this.aquarium.setWater(this.water);
        this.aquarium.setOctopus(this.octopus);
        this.add.image(this.gameWorldCenterX, this.gameWorldCenterY, 'foreground_glass')
            .setDisplaySize(this.gameWorldWidth, this.gameWorldHeight);
        //.setPipeline('Light2D');
        // input
        this.inputKeys = {
            W: this.input.keyboard.addKey('W'),
            S: this.input.keyboard.addKey('S'),
            A: this.input.keyboard.addKey('A'),
            D: this.input.keyboard.addKey('D')
        };
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
        //this.physics.add.collider(this.octopus, this.player);
        // camera
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);
        // keyboard
        this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);
    };
    GameScene.prototype.update = function (time, delta) {
        // update lights
        this.playerLight.setPosition(this.player.x, this.player.y);
        this.octopusLight.setPosition(this.octopus.x, this.octopus.y);
        var playerInWater = this.physics.world.overlap(this.player, this.water);
        // player movement
        if (this.inputKeys.A.isDown) {
            if (playerInWater) {
                this.player.setVelocityX(-600);
            }
            else {
                this.player.setVelocityX(-160);
            }
            this.player.anims.play('left', true);
        }
        else if (this.inputKeys.D.isDown) {
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
        if (this.inputKeys.W.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);
        }
        else if (this.inputKeys.W.isDown && playerInWater) {
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
        // sticks
        this.lightSticks.forEach(function (lightStick) {
            if (!lightStick.body.blocked.down) {
                lightStick.angle += 10;
            }
            else {
                lightStick.setDragX(500);
            }
            lightStick.light.x = lightStick.x;
            lightStick.light.y = lightStick.y;
        });
        // update objects
        this.octopus.update(time, delta);
        this.aquarium.update(time, delta);
    };
    GameScene.prototype.throwLightStick = function () {
        var relativePlayerX = this.mainCamera.centerX;
        var relativePlayerY = this.mainCamera.centerY;
        relativePlayerX += this.player.x - this.mainCamera.midPoint.x;
        relativePlayerY += this.player.y - this.mainCamera.midPoint.y;
        var lightColor = Phaser.Math.Between(0xaaaaaa, 0xffffff);
        var throwAngle = Phaser.Math.Angle.Between(relativePlayerX, relativePlayerY, this.input.activePointer.x, this.input.activePointer.y);
        var lightStick = this.physics.add.sprite(this.player.x, this.player.y, 'lightstick');
        lightStick.setVelocity(400 * Math.cos(throwAngle), 400 * Math.sin(throwAngle));
        lightStick.setScale(0.4);
        lightStick.angle = Phaser.Math.FloatBetween(0, 180);
        lightStick.setCollideWorldBounds(true);
        lightStick.light = this.lights.addLight(lightStick.x, lightStick.y, 400)
            .setIntensity(2)
            .setColor(lightColor);
        lightStick.setTint(lightColor);
        if (this.lights.lights.length > this.lights.maxLights) {
            var light = this.lightSticks[0].light;
            this.lights.removeLight(light);
            this.lightSticks[0].destroy();
            this.lightSticks.shift();
        }
        this.lightSticks.push(lightStick);
        this.physics.add.collider(lightStick, this.worldLayer);
        //this.physics.add.collider(lightStick, this.player);
        this.physics.add.collider(lightStick, this.octopus);
    };
    GameScene.prototype.playerCaught = function () {
        console.log("Fuck!");
        //this.player.setTint(Phaser.Math.Between(0x7f7f7f, 0xffffff));
        this.player.disableBody(true, true);
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;

},{"../Aquarium":1,"../Octopus":2}]},{},[3]);
