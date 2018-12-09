import { Octopus } from "./Octopus";

export class Aquarium extends Phaser.Physics.Arcade.Sprite
{
    private water: Phaser.Physics.Arcade.Image;
    private octopus: Octopus;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
    {
        super(scene, x, y, texture, frame);

        scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
        scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    }
    
    setWater(water: Phaser.Physics.Arcade.Image)
    {
        this.water = water;
    }

    setOctopus(octopus: Octopus)
    {
        this.octopus = octopus;
    }

    update(time: number, delta: number): void
    {
        super.update(time, delta);

       /*  if(this.water != null && this.octopus != null)
        {
            if (this.scene.physics.world.overlap(<any>this.water, <any>this) 
                    && !this.octopus.body.enable)
            {
                this.octopus.release(this.x, this.y);
                this.disableBody(true, true);
            }
        }       */ 
    }
}