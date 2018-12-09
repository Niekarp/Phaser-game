import { LightStickEmitter } from "./LightStickEmitter";
import { LightStick } from "./LightStick";
import { Player } from "./Player";

export class Octopus extends Phaser.Physics.Arcade.Sprite
{
    public growSpeedFactor: number = 500;
    public changeDirectorPeriod: number = 2000;
    public minLightStickDistance: number = 250;
    public minPlayerChaseDistance: number = 500;
    public onPlayerCaughtCallback: ()=>void;

    private released: boolean;
    private defaultVelocity: number = 10;
    private lastChangedDirectionTime: number = 0;
    private lightStickEmitter: LightStickEmitter;
    private player: Player;

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
            
            let playerDistance = Phaser.Math.Distance.Between(this.player.x, this.player.y,
                this.x, this.y);

            // try catch player
            const playerCaught: boolean = this.scene.physics.world.overlap(<any>this.player, <any>this);
            if(playerCaught)
            {
                if(this.onPlayerCaughtCallback)
                {
                    this.onPlayerCaughtCallback();
                }
            }

            // run away from light sticks
            let found = false;
            this.lightStickEmitter.forEachCloseLight(this.x, this.y, this.minLightStickDistance,
                (lighstick: LightStick, angle: number) => {
                    found = true;
                    this.setWalkingAngle(angle);  
            }, this);
            if(found)
            {
                return;
            }
            
            // chase the player
            if(playerDistance < this.minPlayerChaseDistance)
            {
                let angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                this.setWalkingAngle(angle)
                return;
            }

            // bounce from obstacles
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

    public setLightStickEmitter(emitter: LightStickEmitter): void
    {
        this.lightStickEmitter = emitter;
    }

    public setPlayer(player: Player): void
    {
        this.player = player;
    }

    public onPlayerCaught(callback: ()=>void)
    {
        this.onPlayerCaughtCallback = callback;
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

}