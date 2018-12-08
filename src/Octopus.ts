import { LightStick } from "./LightStick";

export class Octopus extends Phaser.Physics.Arcade.Sprite
{
    public growSpeedFactor: number = 500;
    public changeDirectorPeriod: number = 2000;
    public minLightStickDistance: number = 150;

    private released: boolean;
    private defaultVelocity: number = 10;
    private lastChangedDirectionTime: number = 0;
    private lightSticks: LightStick[];

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
    {
        super(scene, x, y, texture, frame);

        scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
        scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        this.disableBody(true, true);
    }

    public update(time: number, delta: number): void
    {
        super.update(time, delta);

        if(this.released)
        {
            this.anims.play('life', true);
            if(this.scaleX < 1.0)
            {
                this.setScale(this.scaleX + delta / this.growSpeedFactor,
                    this.scaleY + delta / this.growSpeedFactor);

                return;
            }

            this.lightSticks.forEach(function(lightStick: LightStick)
            {
                let distance = Phaser.Math.Distance.Between(lightStick.x, lightStick.y,
                    this.x, this.y);
                if(distance < this.minLightStickDistance)
                {
                    this.disableBody(true, true);
                }
            }, this);

            if(this.body.blocked.left)
            {
                this.setWalkingAngle(0 * Math.PI / 2);
            }
            else if(this.body.blocked.right)
            {
                this.setWalkingAngle(2 * Math.PI / 2);
            }
            else if(this.body.blocked.up)
            {
                this.setWalkingAngle(1 * Math.PI / 2);
            }
            else if(this.body.blocked.down)
            {
                this.setWalkingAngle(3 * Math.PI / 2);
            }
            else if(time > this.lastChangedDirectionTime + this.changeDirectorPeriod)
            {
                this.lastChangedDirectionTime = time;
                this.setRandomWalkingAngle();            
            }
        }
    }

    public release(x: number, y: number): void
    {
        this.enableBody(true, x, y, true, true);
        this.setScale(0.1, 0.1);
        this.released = true;
    }

    public setDefaultVelocity(v: number): void
    {
        this.defaultVelocity = v;
    }

    private setRandomWalkingAngle(): void
    {
        this.setWalkingAngle(Phaser.Math.FloatBetween(0, 2 * Math.PI));
    }

    private setWalkingAngle(radians: number): void
    {
        this.setVelocity(this.defaultVelocity * Math.cos(radians),
                this.defaultVelocity * Math.sin(radians));
    }

    public setLightSticks(lightSticks: LightStick[]): void
    {
        this.lightSticks = lightSticks;
    }

}