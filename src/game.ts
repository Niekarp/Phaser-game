/// <reference path="../typescript_defs/phaser.d.ts"/>

import { GameScene } from './scenes/game-scene';

// Game configuration
const gameConfig: GameConfig  = {
    type: Phaser.WEBGL,
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
    render: <RenderConfig>
    {
        maxLights: 15
    },
    scene: GameScene
};

const game = new Phaser.Game(gameConfig);
