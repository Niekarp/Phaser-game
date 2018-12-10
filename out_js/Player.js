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
