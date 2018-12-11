import { InputKeySet } from "./InputKeySet";
import { Water, WaterMovementDirection } from "./Water";
import { Hydrant } from "./Hydrant";

export class Player extends Phaser.Physics.Arcade.Sprite
{
	public maxUnderwaterTime: number = 10000;	
	public underwaterTime: number = 0;
	public onMaxUnderwaterTimeExceeded: ()=>void;

	private onMaxUnderwaterTimeExceededCalled: boolean = false;

	private water: Water;
	// private hydrant: Hydrant;
	private doubleJump: boolean = false;
	private bubbleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	private inputKeys: InputKeySet;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
	{
		super(scene, x, y, texture, frame);

		scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
		scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
	}

	public update(time: number, delta: number): void
    {
		super.update(time, delta);

		const playerInWater = this.water.objectInWater(this);

		if(playerInWater)
		{
			this.underwaterTime += delta;
			if(this.underwaterTime > this.maxUnderwaterTime
				&& this.onMaxUnderwaterTimeExceeded 
				&& !this.onMaxUnderwaterTimeExceededCalled)
			{
				this.onMaxUnderwaterTimeExceeded();
				this.onMaxUnderwaterTimeExceededCalled = true;
			}
		}
		else
		{	
			this.onMaxUnderwaterTimeExceededCalled = false;		
			this.underwaterTime -= delta;
			if(this.underwaterTime < 0)
			{
				this.underwaterTime = 0;
			}
		}

		// movement
		if (this.inputKeys.A.isDown)
		{
			if (playerInWater)
			{
				this.setVelocityX(-600);
			}
			else
			{
				this.setVelocityX(-160);
			}
	
			this.setFlipX(false);
			this.anims.play('left', true);
		}
		else if (this.inputKeys.D.isDown)
		{
			if (playerInWater)
			{
				this.setVelocityX(600);
			}
			else
			{
				this.setVelocityX(160);
			}
	
			this.setFlipX(true);
			this.anims.play('left', true);
		}
		else
		{
			this.setVelocityX(0);
	
			this.anims.play('turn', true);
		}
	
			// movement -> jump
		if (this.inputKeys.W.isDown && playerInWater)
		{
			// console.log('water');
			this.doubleJump = false;
			this.setVelocityY(-600);
		}
		else if (this.inputKeys.W.isDown && this.body.blocked.down)
		{
			// console.log('ground');
			this.doubleJump = true;
			this.setVelocityY(-330);
		}
		else if (this.inputKeys.W.isDown && this.doubleJump)
		{
			// console.log('fly');
			if (this.body.velocity.y > -150)
			{
				this.doubleJump = false;
				this.setVelocityY(-330);
			}
		}

		// bubbles
		if (playerInWater)
		{
			this.bubbleEmitter.emitParticle();
		}
	}

	public setWater(water: Water): void
	{
		this.water = water;
	}

	/* public setHydrant(hydrant: Hydrant): void
	{
		this.hydrant = hydrant;
	} */

	public setBubbleEmitter(bubbleEmitter: Phaser.GameObjects.Particles.ParticleEmitter): void
	{
		this.bubbleEmitter = bubbleEmitter;
	}

	public setInputKeySet(inputKeys: InputKeySet)
	{
		this.inputKeys = inputKeys;
	}

	public getUnderwaterTimeLeft(): string
	{
		let leftTime: string = (100 - (this.underwaterTime / this.maxUnderwaterTime * 100)).toString().slice(0, 3);
		return leftTime;
	}
}