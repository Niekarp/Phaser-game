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
    LightStick.prototype.update = function (time, delta) {
        var inWater = this.water.objectInWater(this);
        if (inWater) {
            if (!this.bubbleEmitter.on) {
                this.bubbleEmitter.start();
            }
        }
        else {
            if (this.bubbleEmitter.on) {
                this.bubbleEmitter.stop();
            }
        }
    };
    return LightStick;
}(Phaser.Physics.Arcade.Sprite));
exports.LightStick = LightStick;
