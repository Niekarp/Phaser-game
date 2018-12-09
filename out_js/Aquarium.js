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
        /*  if(this.water != null && this.octopus != null)
         {
             if (this.scene.physics.world.overlap(<any>this.water, <any>this)
                     && !this.octopus.body.enable)
             {
                 this.octopus.release(this.x, this.y);
                 this.disableBody(true, true);
             }
         }       */
    };
    return Aquarium;
}(Phaser.Physics.Arcade.Sprite));
exports.Aquarium = Aquarium;
