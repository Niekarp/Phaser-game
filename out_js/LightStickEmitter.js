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
