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
        this.waterEmitter.start();
    };
    Hydrant.prototype.close = function () {
        this.opened = false;
        this.waterEmitter.stop();
    };
    Hydrant.prototype.setWaterEmitter = function (waterEmitter) {
        this.waterEmitter = waterEmitter;
    };
    return Hydrant;
}(Phaser.Physics.Arcade.Image));
exports.Hydrant = Hydrant;
