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
