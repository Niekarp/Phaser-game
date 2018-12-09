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
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this, {
            key: "GameScene"
        }) || this;
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
        this.load.image('droplet', ['../assets/droplet.png', '../assets/droplet_n.png']);
        this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
        this.load.spritesheet({
            key: 'hydrant',
            url: '../assets/hydrant.png',
            frameConfig: {
                frameWidth: 62,
                frameHeight: 101
            }
        });
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
        // === configure them ===
        this.gameWorldDimensions = new WorldDimensions_1.WorldDimensions();
        this.gameWorldDimensions.worldWidth = 2080;
        this.gameWorldDimensions.worldHeight = 1280;
        this.gameWorldDimensions.worldCenterX = this.gameWorldDimensions.worldWidth / 2;
        this.gameWorldDimensions.worldCenterY = this.gameWorldDimensions.worldHeight / 2;
        this.gameWorldDimensions.groundHeight = 4 * 32;
        this.inputKeys = new InputKeySet_1.InputKeySet(this);
        // loading game world elements
        this.add.tileSprite(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight, 'background_planks')
            .setPipeline('Light2D');
        // loading game map
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("world_tails", "tiles");
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');
        // === create objects ===
        this.lightStickEmitter = new LightStickEmitter_1.LightStickEmitter(this, 'lightstick');
        this.aquarium = new Aquarium_1.Aquarium(this, 1030, 800, 'aquarium1');
        this.player = new Player_1.Player(this, 0, 0, 'player');
        this.octopus = new Octopus_1.Octopus(this, 0, 0, 'octopus');
        this.add.image(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'foreground_glass')
            .setDisplaySize(this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        //.setPipeline('Light2D');
        this.water = new Water_1.Water(this, 0, 0, 'water');
        // input
        this.inputKeys.addAllKeys();
        // light
        this.lights.enable().setAmbientColor(0x000000);
        this.playerLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 200).setIntensity(0.5);
        this.octopusLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 150).setIntensity(0.5);
        // loading game livings
        this.player.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY);
        this.player.setWater(this.water);
        this.player.setInputKeySet(this.inputKeys);
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.octopus.setBounce(0);
        this.octopus.setCollideWorldBounds(true);
        this.octopus.setDefaultVelocity(300);
        this.octopus.setPlayer(this.player);
        this.octopus.body.allowGravity = false;
        this.octopus.onPlayerCaught(function () { return _this.playerCaught(); });
        this.hydrants = this.physics.add.sprite(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'hydrant');
        this.hydrants.setCollideWorldBounds(true);
        // particles
        var bubblesEmitterManager = this.add.particles('bubbles');
        this.bubblesEmitter = bubblesEmitterManager.createEmitter({
            speed: 60,
            scale: { start: 1, end: 0 },
            maxParticles: 10,
            accelerationY: -400
        });
        this.bubblesEmitter.startFollow(this.player);
        this.bubblesEmitter.stop();
        this.lightStickEmitter.bubbleEmitterManager = bubblesEmitterManager;
        this.lightStickEmitter.bubbleEmitterConfig = {
            speed: 10,
            scale: { start: 0.5, end: 0 },
            accelerationY: -400,
            frequency: 400
        };
        this.octopus.setLightStickEmitter(this.lightStickEmitter);
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
        // particles --> droplets
        /* this.droplets = this.physics.add.group();
        for (var i = 0; i < 500; i++)
        {
            let randomX: number = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
            let randomY: number = Phaser.Math.Between(0, this.gameWorldDimensions.worldHeight);

            let droplet: Phaser.Physics.Arcade.Sprite  = this.droplets.create(randomX, this.water.y, 'droplet');
            
            // let droplet = this.physics.add.sprite(randomX, randomY, 'droplet');
    
            // Enable physics for the droplet
            // this.game.physics.p2.enable(droplet);
            droplet.setCollideWorldBounds(true);
    
            // Add a force that slows down the droplet over time
            droplet.setDamping(false); //).body.damping = 0.3;

            droplet.setMass(3);
            droplet.setBounce(1);
            droplet.setAlpha(0.3);
            // droplet.setGravity(0, 1);
            droplet.setBlendMode(Phaser.BlendModes.ADD);
            // This makes the collision body smaller so that the droplets can get
            // really up close and goopy
            droplet.setCircle(droplet.width * 0.3); //.body.setCircle(droplet.width * 0.3);

            droplet.setPipeline('Light2D');
    
            // Add the droplet to the fluid group
            // droplet.setPipeline('Blur');

            // (<any>droplet.body.allowGravity) = false;
        } */
        /* var blurShader = this.game.add.filter('Blur');
        blurShader.blur = 32;
        var threshShader = this.game.add.filter('Threshold');
        this.fluid.filters = [ blurShader, threshShader ];
        this.fluid.filterArea = this.game.camera.view; */
        // Add WebGL shaders to "liquify" the droplets
        // this.addShaders();
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
        this.anims.create({
            key: 'hydrant_turn',
            frames: [{ key: 'hydrant', frame: 1 }]
        });
        // collisions
        this.physics.world.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.worldLayer);
        this.physics.add.collider(this.octopus, this.worldLayer);
        //this.physics.add.collider(this.octopus, this.player);
        this.physics.add.collider(this.hydrants, this.worldLayer);
        // this.physics.add.collider(this.droplets, this.worldLayer);
        this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);
        // this.physics.add.collider(this.water, this.droplets);
        // camera
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        // keyboard
        this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);
    };
    GameScene.prototype.update = function (time, delta) {
        // update lights
        /* this.playerLight.setPosition(this.player.x, this.player.y);
        this.octopusLight.setPosition(this.octopus.x, this.octopus.y); */
        // droplets
        // console.log('water: ' + (this.water.y - (this.water.displayHeight / 2)));
        /* this.droplets.getChildren().forEach((d, i, arr) => {
            // console.log('droplet: ' + (d as Phaser.Physics.Arcade.Sprite).y);
            let droplet = <Phaser.Physics.Arcade.Sprite>d;
            if ((d as Phaser.Physics.Arcade.Sprite).y > this.water.y - (this.water.displayHeight / 2))
            { */
        // console.log('setVelocity');
        /* this.physics.accelerateTo(d, (d as Phaser.Physics.Arcade.Sprite).x, this.water.y - (this.water.displayHeight / 2), 450, 500, 500); */
        // (d as Phaser.Physics.Arcade.Sprite).setBlendMode(3);
        //(d as Phaser.Physics.Arcade.Sprite).setVelocityY(-100);
        //}
        /* else
        {
            (d as Phaser.Physics.Arcade.Sprite).setVelocityY(0);
        } */
        /* let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y,
            droplet.x, droplet.y);
        if (dist < 100)
        {
            if (droplet.x > this.player.x)
            {
                droplet.setVelocityX(50);
            }
            else
            {
                droplet.setVelocityX(-50);
            }
        }
    }); */
        /* if (this.player.y <  this.water.y - (this.water.displayHeight / 2))
        {
            // this.playerDropletsCollider.destroy();
            this.playerDropletsCollider.active = false;
        }
        else
        {
            this.playerDropletsCollider.active = true;
            // this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);
        } */
        // hydrants
        // this.hydrants.anims.play('hydrant_turn');		
        // update objects
        this.player.update(time, delta);
        this.water.update(time, delta);
        this.octopus.update(time, delta);
        this.aquarium.update(time, delta);
        this.lightStickEmitter.update(time, delta);
    };
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
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
