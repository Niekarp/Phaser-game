import { Water } from "./Water";

export class LightStick extends Phaser.Physics.Arcade.Sprite
{
    public light: Phaser.GameObjects.Light;
    public bubbleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    public water: Water;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string,
        bubbleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter)
    {
        super(scene, x, y, texture, frame);

        scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
        scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        this.bubbleEmitter = bubbleEmitter;

        //this.disableBody(true, true);
    }

    update(time: number, delta: number)
    {
        let inWater = this.water.objectInWater(this);

        if(inWater) 
        {
            if(!this.bubbleEmitter.on)
            {
                this.bubbleEmitter.start();
            }
        }
        else
        {
            if(this.bubbleEmitter.on)
            {
                this.bubbleEmitter.stop();
            }
        }
    }
}