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
        _this.aquariumHeight = 1000;
        _this.water = {
            level: 0.1,
            texture: null
        };
        _this.octopus = {
            isReleased: false,
            sprite: null
        };
        return _this;
    }
    // Phaser scene functions
    GameScene.prototype.preload = function () {
        this.load.image('background_planks', '../assets/background_planks.png');
        console.log('hello');
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
        this.octopus.sprite = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
        this.octopus.sprite.setBounce(1);
        this.octopus.sprite.setCollideWorldBounds(true);
        this.octopus.sprite.disableBody(true, true);
        // loading game world elements
        this.water.texture = this.physics.add.staticImage(400, 535, 'water').setScale(2, 0.1);
        this.water.texture.alpha = 0.5;
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
        this.bubbles = this.add.particles('bubbles');
        this.bubbles_emitter = this.bubbles.createEmitter({
            speed: 60,
            scale: { start: 1, end: 0 },
            // blendMode: 'SCREEN',
            maxParticles: 10,
            accelerationY: -400
        });
        this.bubbles_emitter.startFollow(this.player);
        this.bubbles_emitter.stop();
        // collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.octopus.sprite, this.platforms);
        this.physics.add.collider(this.octopus.sprite, this.player);
    };
    GameScene.prototype.update = function () {
        var playerInWater = this.physics.world.overlap(this.player, this.water.texture);
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
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
        else if (this.cursors.up.isDown && playerInWater) {
            this.player.setVelocityY(-60);
        }
        // player bubbles
        if (playerInWater) {
            this.bubbles_emitter.emitParticle();
        }
        // water level change
        if (this.water.texture.displayHeight <= this.aquariumHeight) {
            this.water.level += 0.01;
            this.water.texture.setScale(2, this.water.level).refreshBody();
        }
        // aquariums releases
        if (this.physics.world.overlap(this.water.texture, this.aquariums) && !this.octopus.isReleased) {
            this.octopus.isReleased = true;
            this.octopus.sprite.enableBody(true, 80, 250 - 32 - 100, true, true);
            this.octopus.sprite.setVelocity(50, 20);
        }
        if (this.octopus.sprite.visible) {
            this.octopus.sprite.anims.play('life', true);
        }
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
