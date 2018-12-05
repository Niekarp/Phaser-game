/// <reference path="../typescript/phaser.d.ts"/>

// import 'phaser';
import { GameScene } from './scenes/game-scene';

// Game configuration
const gameConfig: GameConfig  = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: <PhysicsConfig>
    {
        default: 'arcade',
        arcade: <ArcadeWorldConfig>
        {
            gravity: { y: 450 },
            debug: false
        }
    },
    scene: GameScene
};

const game = new Phaser.Game(gameConfig);
