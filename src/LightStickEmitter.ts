import { LightStick } from "./LightStick";

export class LightStickEmitter
{
    private lightSticks: LightStick[] = [];
    private scene: Phaser.Scene;
    private texture: string;

    constructor(scene: Phaser.Scene, texture: string)
    {
        this.scene = scene;
        this.texture = texture;
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
		});
    }

    public throw(x: number, y: number, throwAngle: number): LightStick
    {
        var lightColor = Phaser.Math.Between(0xaaaaaa, 0xffffff);
        var lightStick = new LightStick(this.scene, x, y, this.texture);
		lightStick.setVelocity(400 * Math.cos(throwAngle), 400 * Math.sin(throwAngle));
		lightStick.setScale(0.4);
		lightStick.angle = Phaser.Math.FloatBetween(0, 180);
		lightStick.setCollideWorldBounds(true);
		lightStick.light = this.scene.lights.addLight(lightStick.x, lightStick.y, 400)
		lightStick.light.setIntensity(2)
		lightStick.light.setColor(lightColor);
		lightStick.setTint(lightColor);
		
		if(this.scene.lights.lights.length > this.scene.lights.maxLights)
		{
			this.scene.lights.removeLight(this.lightSticks[0].light);
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