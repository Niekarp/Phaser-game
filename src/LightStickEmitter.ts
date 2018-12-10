import { LightStick } from "./LightStick";
import { Water } from "./Water";

export class LightStickEmitter
{
    public velocity: number = 400;
    public bubbleEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    public bubbleEmitterConfig: ParticleEmitterConfig;
    public followOffsetY: number = -20;
    public water: Water;

    private lightSticks: LightStick[] = [];
    private scene: Phaser.Scene;
    private texture: string;

    constructor(scene: Phaser.Scene, texture: string)
    {
        this.scene = scene;
        this.texture = texture;
        this.water = null;
    }

    public update(time: number, delta: number): void
    {
        this.lightSticks.forEach((lightStick : LightStick) => {
			if(!lightStick.body.blocked.down) 
			{
				lightStick.angle += 10;				
			}
			else
			{
				lightStick.setDragX(500);
			}
			lightStick.light.x = lightStick.x;
            lightStick.light.y = lightStick.y;
            
            lightStick.update(time, delta);
		});
    }

    public throw(x: number, y: number, throwAngle: number): LightStick
    {
        var lightColor = Phaser.Math.Between(0xaaaaaa, 0xffffff);
        var lightStick = new LightStick(this.scene, x, y, this.texture);
        lightStick.setVelocity(this.velocity * Math.cos(throwAngle),
                this.velocity * Math.sin(throwAngle));
		lightStick.setScale(0.4);
		lightStick.angle = Phaser.Math.FloatBetween(0, 180);
		lightStick.setCollideWorldBounds(true);
		lightStick.light = this.scene.lights.addLight(lightStick.x, lightStick.y, 400)
		lightStick.light.setIntensity(2)
		lightStick.light.setColor(lightColor);
        lightStick.setTint(lightColor);
        lightStick.water = this.water;
        
        if(this.bubbleEmitterManager)
        {
            let emitter = this.bubbleEmitterManager.createEmitter(this.bubbleEmitterConfig);
            lightStick.bubbleEmitter = emitter;
            lightStick.bubbleEmitter.startFollow(lightStick);
            lightStick.bubbleEmitter.stop();
            lightStick.bubbleEmitter.followOffset.y = this.followOffsetY;
        }
		
		if(this.scene.lights.lights.length > this.scene.lights.maxLights)
		{
            this.scene.lights.removeLight(this.lightSticks[0].light);
            this.lightSticks[0].bubbleEmitter.stop();
			this.lightSticks[0].destroy();
			this.lightSticks.shift();
        }
		
        this.lightSticks.push(lightStick);
        
        return lightStick;
    }

    forEachCloseLight(x: number, y: number, minDistance: number,
        callback: (lighStick: LightStick, angle: number)=>void, context?: any)
    {
        this.lightSticks.forEach((lightStick: LightStick) =>
        {
            let distance = Phaser.Math.Distance.Between(lightStick.x, lightStick.y, x, y);
            if(distance < minDistance)
            {
                let angle = Phaser.Math.Angle.Between(lightStick.x, lightStick.y, x, y);
                callback.bind(context)(lightStick, angle);
            }
        }, this);
    }
}