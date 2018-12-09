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
exports.__esModule = true;
var InputKeySet = /** @class */ (function () {
    function InputKeySet(scene) {
        this.scene = scene;
    }
    InputKeySet.prototype.addAllKeys = function () {
        this.W = this.scene.input.keyboard.addKey('W');
        this.S = this.scene.input.keyboard.addKey('S');
        this.A = this.scene.input.keyboard.addKey('A');
        this.D = this.scene.input.keyboard.addKey('D');
        this.F = this.scene.input.keyboard.addKey('F');
    };
    return InputKeySet;
}());
exports.InputKeySet = InputKeySet;

},{}],3:[function(require,module,exports){
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
var LightStick = /** @class */ (function (_super) {
    __extends(LightStick, _super);
    function LightStick(scene, x, y, texture, frame, bubbleEmitter) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.sys.updateList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        _this.bubbleEmitter = bubbleEmitter;
        return _this;
        //this.disableBody(true, true);
    }
    return LightStick;
}(Phaser.Physics.Arcade.Sprite));
exports.LightStick = LightStick;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var LightStick_1 = require("./LightStick");
var LightStickEmitter = /** @class */ (function () {
    function LightStickEmitter(scene, texture) {
        this.velocity = 400;
        this.followOffsetY = -20;
        this.lightSticks = [];
        this.scene = scene;
        this.texture = texture;
    }
    LightStickEmitter.prototype.update = function (time, delta) {
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
    };
    LightStickEmitter.prototype["throw"] = function (x, y, throwAngle) {
        var lightColor = Phaser.Math.Between(0xaaaaaa, 0xffffff);
        var lightStick = new LightStick_1.LightStick(this.scene, x, y, this.texture);
        lightStick.setVelocity(this.velocity * Math.cos(throwAngle), this.velocity * Math.sin(throwAngle));
        lightStick.setScale(0.4);
        lightStick.angle = Phaser.Math.FloatBetween(0, 180);
        lightStick.setCollideWorldBounds(true);
        lightStick.light = this.scene.lights.addLight(lightStick.x, lightStick.y, 400);
        lightStick.light.setIntensity(2);
        lightStick.light.setColor(lightColor);
        lightStick.setTint(lightColor);
        if (this.bubbleEmitterManager) {
            var emitter = this.bubbleEmitterManager.createEmitter(this.bubbleEmitterConfig);
            lightStick.bubbleEmitter = emitter;
            lightStick.bubbleEmitter.startFollow(lightStick);
            lightStick.bubbleEmitter.start();
            lightStick.bubbleEmitter.followOffset.y = this.followOffsetY;
        }
        if (this.scene.lights.lights.length > this.scene.lights.maxLights) {
            this.scene.lights.removeLight(this.lightSticks[0].light);
            this.lightSticks[0].bubbleEmitter.stop();
            this.lightSticks[0].destroy();
            this.lightSticks.shift();
        }
        this.lightSticks.push(lightStick);
        return lightStick;
    };
    LightStickEmitter.prototype.forEachCloseLight = function (x, y, minDistance, callback, context) {
        this.lightSticks.forEach(function (lightStick) {
            var distance = Phaser.Math.Distance.Between(lightStick.x, lightStick.y, x, y);
            if (distance < minDistance) {
                var angle = Phaser.Math.Angle.Between(lightStick.x, lightStick.y, x, y);
                callback.bind(context)(lightStick, angle);
            }
        }, this);
    };
    return LightStickEmitter;
}());
exports.LightStickEmitter = LightStickEmitter;

},{"./LightStick":3}],5:[function(require,module,exports){
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
            var found_1 = false;
            this.lightStickEmitter.forEachCloseLight(this.x, this.y, this.minLightStickDistance, function (lighstick, angle) {
                found_1 = true;
                _this.setWalkingAngle(angle);
            }, this);
            if (found_1) {
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
    Octopus.prototype.setLightStickEmitter = function (emitter) {
        this.lightStickEmitter = emitter;
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

},{}],6:[function(require,module,exports){
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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.sys.updateList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        return _this;
    }
    Player.prototype.update = function (time, delta) {
        _super.prototype.update.call(this, time, delta);
        var playerInWater = this.scene.physics.world.overlap(this, this.water);
        // player movement
        if (this.inputKeys.A.isDown) {
            if (playerInWater) {
                this.setVelocityX(-600);
            }
            else {
                this.setVelocityX(-160);
            }
            this.anims.play('left', true);
        }
        else if (this.inputKeys.D.isDown) {
            if (playerInWater) {
                this.setVelocityX(600);
            }
            else {
                this.setVelocityX(160);
            }
            this.anims.play('right', true);
        }
        else {
            this.setVelocityX(0);
            this.anims.play('turn');
        }
        // player movement -> player jump
        if (this.inputKeys.W.isDown && this.body.blocked.down) {
            this.setVelocityY(-330);
        }
        else if (this.inputKeys.W.isDown && playerInWater) {
            this.setVelocityY(-600);
        }
        /* // player actions
        if (this.scene.physics.world.overlap(<any>this, <any>this.hydrants) && this.inputKeys.F.isDown && this.waterGoUp)
        {
            this.waterGoUp = false;
        } */
        /* // player bubbles
        if (playerInWater)
        {
            this.bubblesEmitter.emitParticle();
        } */
    };
    Player.prototype.setWater = function (water) {
        this.water = water;
    };
    Player.prototype.setInputKeySet = function (inputKeys) {
        this.inputKeys = inputKeys;
    };
    return Player;
}(Phaser.Physics.Arcade.Sprite));
exports.Player = Player;

},{}],7:[function(require,module,exports){
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
var WaterMovementDirection;
(function (WaterMovementDirection) {
    WaterMovementDirection[WaterMovementDirection["Up"] = 0] = "Up";
    WaterMovementDirection[WaterMovementDirection["Down"] = 1] = "Down";
    WaterMovementDirection[WaterMovementDirection["None"] = 2] = "None";
})(WaterMovementDirection = exports.WaterMovementDirection || (exports.WaterMovementDirection = {}));
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.STATIC_BODY);
        return _this;
    }
    Water.prototype.update = function (time, delta) {
        _super.prototype.update.call(this, time, this.data);
        // water level change
        if (this.displayHeight <= this.waterHeightLimit && this.waterMovementDirection == WaterMovementDirection.Up) {
            this.setDisplaySize(this.displayWidth, this.displayHeight + 0.1).refreshBody();
        }
        else if (this.displayHeight > 0 && this.waterMovementDirection == WaterMovementDirection.Down) {
            this.setDisplaySize(this.displayWidth, this.displayHeight - 1).refreshBody();
        }
        this.setPosition(this.worldDimensions.worldCenterX, this.worldDimensions.groundHeight - this.worldDimensions.groundHeight - (this.displayHeight / 2));
    };
    Water.prototype.setWaterHeightLimit = function (newLimit) {
        this.waterHeightLimit = newLimit;
    };
    Water.prototype.setWaterMovementDirection = function (newDirection) {
        this.waterMovementDirection = newDirection;
    };
    Water.prototype.setWorldDimensions = function (dimensions) {
        this.worldDimensions = dimensions;
    };
    return Water;
}(Phaser.Physics.Arcade.Image));
exports.Water = Water;

},{}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var WorldDimensions = /** @class */ (function () {
    function WorldDimensions() {
    }
    return WorldDimensions;
}());
exports.WorldDimensions = WorldDimensions;

},{}],9:[function(require,module,exports){
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

},{"./scenes/game-scene":10}],10:[function(require,module,exports){
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
        // === create objects ===
        this.gameWorldDimensions = new WorldDimensions_1.WorldDimensions();
        this.inputKeys = new InputKeySet_1.InputKeySet(this);
        this.player = new Player_1.Player(this, 0, 0, 'player');
        this.octopus = new Octopus_1.Octopus(this, 0, 0, 'octopus');
        this.lightStickEmitter = new LightStickEmitter_1.LightStickEmitter(this, 'lightstick');
        this.water = new Water_1.Water(this, 0, 0, 'water');
        this.aquarium = new Aquarium_1.Aquarium(this, 1030, 800, 'aquarium1');
        // === configure them ===
        this.gameWorldDimensions.worldWidth = 2080;
        this.gameWorldDimensions.worldHeight = 1280;
        this.gameWorldDimensions.worldCenterX = this.gameWorldDimensions.worldWidth / 2;
        this.gameWorldDimensions.worldCenterY = this.gameWorldDimensions.worldHeight / 2;
        this.gameWorldDimensions.groundHeight = 4 * 32;
        // input
        this.inputKeys.addAllKeys();
        // light
        this.lights.enable().setAmbientColor(0x000000);
        this.playerLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 200).setIntensity(0.5);
        this.octopusLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 150).setIntensity(0.5);
        // loading game world elements
        this.add.tileSprite(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight, 'background_planks')
            .setPipeline('Light2D');
        // loading game map
        var map = this.make.tilemap({ key: "map" });
        var tileset = map.addTilesetImage("world_tails", "tiles");
        this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');
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
        this.add.image(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'foreground_glass')
            .setDisplaySize(this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        //.setPipeline('Light2D');
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
        this.playerLight.setPosition(this.player.x, this.player.y);
        this.octopusLight.setPosition(this.octopus.x, this.octopus.y);
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
        this.hydrants.anims.play('hydrant_turn');
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

},{"../Aquarium":1,"../InputKeySet":2,"../LightStickEmitter":4,"../Octopus":5,"../Player":6,"../Water":7,"../WorldDimensions":8}]},{},[9]);
