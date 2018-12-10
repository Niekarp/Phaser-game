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
var LightStickEmitter_1 = require("../LightStickEmitter");
var Octopus_1 = require("../Octopus");
var Aquarium_1 = require("../Aquarium");
var Player_1 = require("../Player");
var InputKeySet_1 = require("../InputKeySet");
var WorldDimensions_1 = require("../WorldDimensions");
var Water_1 = require("../Water");
var Hydrant_1 = require("../Hydrant");
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, {
            key: "GameScene"
        }) || this;
        _this.hydrantCount = 10;
        _this.openHydrants = _this.hydrantCount;
        _this.dropletsCount = 200;
        return _this;
    }
    // Phaser scene functions
    /*
    _____          _                 _
    |  __ \        | |               | |
    | |__) | __ ___| | ___   __ _  __| |
    |  ___/ '__/ _ \ |/ _ \ / _` |/ _` |
    | |   | | |  __/ | (_) | (_| | (_| |
    |_|   |_|  \___|_|\___/ \__,_|\__,_|
                                        
                                           
    */
    GameScene.prototype.preload = function () {
        this.load.image("tiles", ["../assets/world_tails.png", "../assets/world_tails_n.png"]);
        this.load.tilemapTiledJSON("map", "../assets/game_map.json");
        this.load.image('background_planks', ['../assets/background_planks.png', '../assets/background_planks_n.png']);
        this.load.image('water', ['../assets/water.png', '../assets/water_n.png']);
        this.load.image('aquarium1', ['../assets/aquarium_1.png', '../assets/aquarium_1_n.png']);
        this.load.image('hydrant1', ['../assets/hydrant_1.png', '../assets/hydrant_1_n.png']);
        this.load.image('lightstick', '../assets/lightstick.png');
        this.load.image('bubbles', '../assets/bubble_small.png');
        this.load.image('droplet', ['../assets/droplet.png', '../assets/droplet_n.png']);
        this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
        this.load.spritesheet({
            key: 'player',
            url: '../assets/player_xd.png',
            frameConfig: {
                frameWidth: 152,
                frameHeight: 89
            }
        });
        this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
    };
    /*
    _____                _
    / ____|              | |
   | |     _ __ ___  __ _| |_ ___
   | |    | '__/ _ \/ _` | __/ _ \
   | |____| | |  __/ (_| | ||  __/
    \_____|_|  \___|\__,_|\__\___|
                                  
                                  
    */
    GameScene.prototype.create = function () {
        // === INITIAL CONFIGURATION ===
        var _this = this;
        // configure world dimensions
        this.gameWorldDimensions = new WorldDimensions_1.WorldDimensions();
        this.gameWorldDimensions.worldWidth = 2080;
        this.gameWorldDimensions.worldHeight = 1280;
        this.gameWorldDimensions.worldCenterX = this.gameWorldDimensions.worldWidth / 2;
        this.gameWorldDimensions.worldCenterY = this.gameWorldDimensions.worldHeight / 2;
        this.gameWorldDimensions.groundHeight = 4 * 32;
        // input
        this.inputKeys = new InputKeySet_1.InputKeySet(this);
        this.inputKeys.addAllKeys();
        this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);
        // ===
        // === CREATING OBJECTS ===		
        // background
        this.add.tileSprite(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight, 'background_planks')
            .setPipeline('Light2D');
        //  game map
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("world_tails", "tiles");
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');
        // dead objects
        this.aquarium = new Aquarium_1.Aquarium(this, 1030, 800, 'aquarium1');
        this.hydrants = this.physics.add.staticGroup();
        for (var i_1 = 0; i_1 < this.hydrantCount; ++i_1) {
            var hydrant = new Hydrant_1.Hydrant(this, 0, 0, 'hydrant1');
            this.hydrants.add(hydrant);
        }
        this.hydrantMen = this.physics.add.group();
        for (var i_2 = 0, sectorWidth = this.gameWorldDimensions.worldWidth / this.hydrantCount, currentSectorBegin = 0; i_2 < this.hydrantCount; ++i_2) {
            var randomX = Phaser.Math.Between(currentSectorBegin, currentSectorBegin + sectorWidth);
            this.hydrantMen.create(randomX, 0, 'hydrant1');
            currentSectorBegin += sectorWidth;
            /* let randomX: number = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
            this.hydrantMen.create(randomX, this.gameWorldDimensions.worldCenterY, 'hydrant1'); */
        }
        this.lightStickEmitter = new LightStickEmitter_1.LightStickEmitter(this, 'lightstick');
        // alive objects
        this.player = new Player_1.Player(this, 0, 0, 'player');
        this.octopus = new Octopus_1.Octopus(this, 0, 0, 'octopus');
        this.water = new Water_1.Water(this, 0, 0, 'water');
        // particles
        var bubblesEmitterManager = this.add.particles('bubbles');
        this.bubblesEmitter = bubblesEmitterManager.createEmitter({
            speed: 60,
            scale: { start: 1, end: 0 },
            maxParticles: 10,
            accelerationY: -400
        });
        var waterEmitterManager = this.add.particles('droplet');
        // foreground
        this.add.image(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'foreground_glass')
            .setDisplaySize(this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        // ===
        // === INITIALIZE OBJECTS ===
        // loading game livings
        this.player.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY);
        this.player.setWater(this.water);
        this.player.setBubbleEmitter(this.bubblesEmitter);
        this.player.setInputKeySet(this.inputKeys);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.octopus.setBounce(0);
        this.octopus.setCollideWorldBounds(true);
        this.octopus.setDefaultVelocity(300);
        this.octopus.setPlayer(this.player);
        this.octopus.body.allowGravity = false;
        this.octopus.onPlayerCaught(function () { return _this.playerCaught(); });
        // loading game world elements
        this.water.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight);
        this.water.setWaterHeightLimit(this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight - 100);
        this.water.setWaterMovementDirection(Water_1.WaterMovementDirection.Up);
        this.water.setWorldDimensions(this.gameWorldDimensions);
        this.water.setDisplaySize(this.gameWorldDimensions.worldWidth, 0);
        this.water.alpha = 0.5;
        this.water.setPipeline('Light2D');
        this.aquarium.setPipeline('Light2D');
        this.aquarium.setWater(this.water);
        this.aquarium.setOctopus(this.octopus);
        this.hydrants.getChildren().forEach(function (hydrant) {
            var waterEmitter = waterEmitterManager.createEmitter({
                speed: 60,
                scale: { start: 1, end: 0 },
                maxParticles: 50,
                accelerationY: 400,
                alpha: 0.2
            });
            waterEmitter.startFollow(hydrant);
            hydrant.setWaterEmitter(waterEmitter);
            hydrant.open();
            hydrant.setPipeline('Light2D');
        });
        // light
        this.lights.enable().setAmbientColor(0x000000);
        this.playerLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 200).setIntensity(0.5);
        this.octopusLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 150).setIntensity(0.5);
        // particles
        /* this.bubblesEmitter.setSpeed(60);
        this.bubblesEmitter.setScale({ start: 1, end: 0 });
        this.bubblesEmitter.maxParticles = 10;
        this.bubblesEmitter.accelerationY = <Phaser.GameObjects.Particles.EmitterOp>{ propertyKey: 'accelerationY', propertyValue: -400 }; */
        this.bubblesEmitter.startFollow(this.player);
        this.bubblesEmitter.stop();
        this.lightStickEmitter.bubbleEmitterManager = bubblesEmitterManager;
        this.lightStickEmitter.bubbleEmitterConfig = {
            speed: 10,
            scale: { start: 0.5, end: 0 },
            accelerationY: -400,
            frequency: 400
        };
        this.lightStickEmitter.water = this.water;
        this.octopus.setLightStickEmitter(this.lightStickEmitter);
        // particles --> droplets
        this.droplets = this.physics.add.group();
        for (var i = 0; i < this.dropletsCount; i++) {
            var randomX = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
            var droplet = this.droplets.create(randomX, this.water.y, 'droplet');
            droplet.setCollideWorldBounds(true);
            droplet.setDamping(false);
            droplet.setMass(1.5);
            droplet.setBounce(1);
            droplet.setAlpha(0.3);
            droplet.setBlendMode(Phaser.BlendModes.ADD);
            droplet.setCircle(droplet.width * 0.3);
            droplet.setPipeline('Light2D');
            droplet.disableBody(true, true);
            this.dropletsVisible = false;
        }
        // ===
        // === OTHER ===
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
        // collisions
        this.physics.world.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.collider(this.octopus, this.worldLayer);
        this.physics.add.collider(this.hydrants, this.worldLayer);
        this.hydrantMen.getChildren().forEach(function (hMan, idx) {
            var correspondingHydrant = _this.hydrants.getChildren()[idx];
            _this.physics.add.collider(hMan, _this.worldLayer, function (hydrantMan, wl) {
                _this.hydrantHydrantManCollide(correspondingHydrant, hydrantMan);
            });
            _this.physics.add.overlap(correspondingHydrant, _this.player, function (hydrant, player) {
                _this.hydrantPlayerOverlap(hydrant, player);
            });
        });
        this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);
        // camera
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        // ===
    };
    /*
    _    _           _       _
    | |  | |         | |     | |
    | |  | |_ __   __| | __ _| |_ ___
    | |  | | '_ \ / _` |/ _` | __/ _ \
    | |__| | |_) | (_| | (_| | ||  __/
     \____/| .__/ \__,_|\__,_|\__\___|
           | |
           |_|
                                  
                                  
    */
    GameScene.prototype.update = function (time, delta) {
        // lights
        this.playerLight.setPosition(this.player.x, this.player.y);
        this.octopusLight.setPosition(this.octopus.x, this.octopus.y);
        // droplets
        this.updateDroplets();
        this.checkPlayerOverDroplets();
        this.dropletsCheckWaterLevel();
        // update objects
        this.player.update(time, delta);
        this.water.update(time, delta);
        this.octopus.update(time, delta);
        this.aquarium.update(time, delta);
        this.lightStickEmitter.update(time, delta);
    };
    /*
    ____  _   _
    / __ \| | | |
   | |  | | |_| |__   ___ _ __
   | |  | | __| '_ \ / _ \ '__|
   | |__| | |_| | | |  __/ |
    \____/ \__|_| |_|\___|_|
                               
                                
    */
    GameScene.prototype.throwLightStick = function () {
        var relativePlayerX = this.mainCamera.centerX;
        var relativePlayerY = this.mainCamera.centerY;
        relativePlayerX += this.player.x - this.mainCamera.midPoint.x;
        relativePlayerY += this.player.y - this.mainCamera.midPoint.y;
        var throwAngle = Phaser.Math.Angle.Between(relativePlayerX, relativePlayerY, this.input.activePointer.x, this.input.activePointer.y);
        var lightStick = this.lightStickEmitter["throw"](this.player.x, this.player.y, throwAngle);
        this.physics.add.collider(lightStick, this.worldLayer);
        //this.physics.add.collider(lightStick, this.player);
        this.physics.add.collider(lightStick, this.octopus);
    };
    GameScene.prototype.playerCaught = function () {
        console.log("Fuck!");
        //this.player.setTint(Phaser.Math.Between(0x7f7f7f, 0xffffff));
        this.player.disableBody(true, true);
    };
    GameScene.prototype.hydrantHydrantManCollide = function (hydrant, hydrantMan) {
        hydrant.enableBody(false, 0, 0, true, true);
        hydrant.setPosition(hydrantMan.x, hydrantMan.y).refreshBody();
        hydrantMan.disableBody(true, true);
    };
    GameScene.prototype.hydrantPlayerOverlap = function (hydrant, player) {
        if (this.inputKeys.F.isDown
            && hydrant.isOpen()
            && this.water.getWaterMovementDirection() == Water_1.WaterMovementDirection.Up) {
            hydrant.close();
            this.openHydrants -= 1;
            if (this.openHydrants == 0) {
                this.water.setWaterMovementDirection(Water_1.WaterMovementDirection.Down);
            }
        }
    };
    GameScene.prototype.updateDroplets = function () {
        var _this = this;
        // droplets
        this.droplets.getChildren().forEach(function (d, i, arr) {
            var droplet = d;
            if (droplet.y > _this.water.y - (_this.water.displayHeight / 2)) {
                droplet.setVelocityY(-100);
            }
            var dist = Phaser.Math.Distance.Between(_this.player.x, _this.player.y, droplet.x, droplet.y);
            var distX = Math.sqrt(Math.pow((_this.player.x - droplet.x), 2));
            if (dist < 50) {
                if (droplet.x > _this.player.x) {
                    droplet.setVelocityX(30);
                }
                else {
                    droplet.setVelocityX(-30);
                }
            }
            else if (distX > _this.mainCamera.displayWidth / 2
                && _this.player.x < _this.gameWorldDimensions.worldWidth - _this.mainCamera.displayWidth / 2
                && _this.player.x > _this.mainCamera.displayWidth / 2) {
                var newX = Phaser.Math.Between(_this.player.x - _this.mainCamera.displayWidth / 2, _this.player.x + _this.mainCamera.displayWidth / 2);
                droplet.setPosition(newX, droplet.y);
            }
        });
    };
    GameScene.prototype.checkPlayerOverDroplets = function () {
        if (this.player.y < this.water.y - (this.water.displayHeight / 2)) {
            this.playerDropletsCollider.active = false;
        }
        else {
            this.playerDropletsCollider.active = true;
        }
    };
    GameScene.prototype.dropletsCheckWaterLevel = function () {
        // console.log('water: ' + this.water.getCurrentY() + ' > '+ )
        var littleOverGround = this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight - 100;
        if (this.water.getCurrentY() > littleOverGround && this.dropletsVisible) {
            this.droplets.getChildren().forEach(function (droplet) {
                droplet.disableBody(true, true);
            });
            this.dropletsVisible = false;
        }
        else if (this.water.getCurrentY() < littleOverGround && !this.dropletsVisible) {
            this.droplets.getChildren().forEach(function (droplet) {
                droplet.enableBody(false, -100, -100, true, true);
            });
            this.dropletsVisible = true;
        }
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
