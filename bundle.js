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
var Hydrant = /** @class */ (function (_super) {
    __extends(Hydrant, _super);
    function Hydrant(scene, x, y, texture, frame) {
        var _this = _super.call(this, scene, x, y, texture, frame) || this;
        _this.opened = false;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.STATIC_BODY);
        _this.disableBody(true, true);
        return _this;
    }
    Hydrant.prototype.isOpen = function () {
        return this.opened;
    };
    Hydrant.prototype.open = function () {
        this.opened = true;
    };
    Hydrant.prototype.close = function () {
        this.opened = false;
    };
    return Hydrant;
}(Phaser.Physics.Arcade.Image));
exports.Hydrant = Hydrant;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./LightStick":4}],6:[function(require,module,exports){
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
        // movement
        if (this.inputKeys.A.isDown) {
            if (playerInWater) {
                this.setVelocityX(-600);
            }
            else {
                this.setVelocityX(-160);
            }
            this.scene.anims.play('left', this);
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
        // movement -> jump
        if (this.inputKeys.W.isDown && this.body.blocked.down) {
            this.setVelocityY(-330);
        }
        else if (this.inputKeys.W.isDown && playerInWater) {
            this.setVelocityY(-600);
        }
        // bubbles
        if (playerInWater) {
            this.bubbleEmitter.emitParticle();
        }
    };
    Player.prototype.setWater = function (water) {
        this.water = water;
    };
    /* public setHydrant(hydrant: Hydrant): void
    {
        this.hydrant = hydrant;
    } */
    Player.prototype.setBubbleEmitter = function (bubbleEmitter) {
        this.bubbleEmitter = bubbleEmitter;
    };
    Player.prototype.setInputKeySet = function (inputKeys) {
        this.inputKeys = inputKeys;
    };
    return Player;
}(Phaser.Physics.Arcade.Sprite));
exports.Player = Player;

},{}],8:[function(require,module,exports){
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
        // scene.physics.add.sys.updateList.add(this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.STATIC_BODY);
        return _this;
    }
    Water.prototype.update = function (time, delta) {
        _super.prototype.update.call(this, time, this.data);
        // water level change
        // console.log(this.displayHeight + '<' + this.waterHeightLimit + ';' + (this.waterMovementDirection == WaterMovementDirection.Up));
        // console.log('x: ' + this.x, 'y: ' + this.y);
        if (this.displayHeight <= this.waterHeightLimit && this.waterMovementDirection == WaterMovementDirection.Up) {
            this.setDisplaySize(this.displayWidth, this.displayHeight + 0.1).refreshBody();
        }
        else if (this.displayHeight > 0 && this.waterMovementDirection == WaterMovementDirection.Down) {
            this.setDisplaySize(this.displayWidth, this.displayHeight - 1).refreshBody();
        }
        this.setPosition(this.worldDimensions.worldCenterX, this.worldDimensions.worldHeight - this.worldDimensions.groundHeight - (this.displayHeight / 2));
    };
    Water.prototype.setWaterHeightLimit = function (newLimit) {
        this.waterHeightLimit = newLimit;
    };
    Water.prototype.setWaterMovementDirection = function (newDirection) {
        this.waterMovementDirection = newDirection;
    };
    Water.prototype.getWaterMovementDirection = function () {
        return this.waterMovementDirection;
    };
    Water.prototype.setWorldDimensions = function (dimensions) {
        this.worldDimensions = dimensions;
    };
    return Water;
}(Phaser.Physics.Arcade.Image));
exports.Water = Water;

},{}],9:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var WorldDimensions = /** @class */ (function () {
    function WorldDimensions() {
    }
    return WorldDimensions;
}());
exports.WorldDimensions = WorldDimensions;

},{}],10:[function(require,module,exports){
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

},{"./scenes/game-scene":11}],11:[function(require,module,exports){
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
        for (var i_2 = 0; i_2 < this.hydrantCount; ++i_2) {
            var randomX = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
            this.hydrantMen.create(randomX, this.gameWorldDimensions.worldCenterY, 'hydrant1');
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
        // foreground
        this.add.image(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'foreground_glass')
            .setDisplaySize(this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);
        // ===
        // === INITIALIZE OBJECTS ===
        // loading game livings
        this.player.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY);
        this.player.setWater(this.water);
        // this.player.setHydrant(this.hydrants);
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
        this.octopus.setLightStickEmitter(this.lightStickEmitter);
        // particles --> droplets
        this.droplets = this.physics.add.group();
        for (var i = 0; i < 500; i++) {
            var randomX = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
            var droplet = this.droplets.create(randomX, this.water.y, 'droplet');
            droplet.setCollideWorldBounds(true);
            droplet.setDamping(false);
            droplet.setMass(2);
            droplet.setBounce(1);
            droplet.setAlpha(0.3);
            droplet.setBlendMode(Phaser.BlendModes.ADD);
            droplet.setCircle(droplet.width * 0.3);
            droplet.setPipeline('Light2D');
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
        var _this = this;
        // lights
        this.playerLight.setPosition(this.player.x, this.player.y);
        this.octopusLight.setPosition(this.octopus.x, this.octopus.y);
        // droplets
        this.droplets.getChildren().forEach(function (d, i, arr) {
            var droplet = d;
            if (droplet.y > _this.water.y - (_this.water.displayHeight / 2)) {
                droplet.setVelocityY(-100);
            }
            var dist = Phaser.Math.Distance.Between(_this.player.x, _this.player.y, droplet.x, droplet.y);
            if (dist < 100) {
                if (droplet.x > _this.player.x) {
                    droplet.setVelocityX(50);
                }
                else {
                    droplet.setVelocityX(-50);
                }
            }
            else if (dist > 500) {
                var newX = Phaser.Math.Between(_this.player.x - _this.mainCamera.width / 2, _this.player.x + _this.mainCamera.width / 2);
                droplet.setPosition(newX, droplet.y);
            }
        });
        if (this.player.y < this.water.y - (this.water.displayHeight / 2)) {
            this.playerDropletsCollider.active = false;
        }
        else {
            this.playerDropletsCollider.active = true;
        }
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
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;

},{"../Aquarium":1,"../Hydrant":2,"../InputKeySet":3,"../LightStickEmitter":5,"../Octopus":6,"../Player":7,"../Water":8,"../WorldDimensions":9}]},{},[10]);
