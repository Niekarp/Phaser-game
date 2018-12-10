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
        else if (this.displayHeight > -5 && this.waterMovementDirection == WaterMovementDirection.Down) {
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
    Water.prototype.getCurrentY = function () {
        return this.y - (this.displayHeight / 2);
    };
    return Water;
}(Phaser.Physics.Arcade.Image));
exports.Water = Water;
