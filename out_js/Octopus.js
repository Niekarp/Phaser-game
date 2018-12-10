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
        _this.previousVelocityX = 0;
        _this.previousVelocityY = 0;
        scene.physics.add.sys.displayList.add(_this);
        scene.physics.add.sys.updateList.add(_this);
        scene.physics.add.world.enableBody(_this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        //this.setCircle(0.75 * (this.width + this.height) / 2);
        _this.disableBody(true, true);
        return _this;
    }
    Octopus.prototype.update = function (time, delta) {
        var _this = this;
        _super.prototype.update.call(this, time, delta);
        if (this.released) {
            this.anims.play('life', true);
            if (this.scaleX < 0.75) {
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
        var newVelocityX = (3 * this.previousVelocityX + this.defaultVelocity * Math.cos(radians)) / 4;
        var newVelocityY = (3 * this.previousVelocityY + this.defaultVelocity * Math.cos(radians)) / 4;
        this.setVelocity(this.defaultVelocity * Math.cos(radians), this.defaultVelocity * Math.sin(radians));
        this.previousVelocityX = newVelocityX;
        this.previousVelocityY = newVelocityY;
    };
    return Octopus;
}(Phaser.Physics.Arcade.Sprite));
exports.Octopus = Octopus;
