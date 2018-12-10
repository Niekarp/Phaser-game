import { InputKeySet } from "./InputKeySet";
import { Water, WaterMovementDirection } from "./Water";
import { Hydrant } from "./Hydrant";

export class Player extends Phaser.Physics.Arcade.Sprite
{
	private water: Water;
	// private hydrant: Hydrant;
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

		const playerInWater: boolean = this.scene.physics.world.overlap(<any>this, <any>this.water);

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
	
			this.scene.anims.play('left', this);
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
	
			this.anims.play('right', true);
		}
		else
		{
			this.setVelocityX(0);
	
			this.anims.play('turn');
		}
	
			// movement -> jump
		if (this.inputKeys.W.isDown && this.body.blocked.down)
		{
			this.setVelocityY(-330);
		}
		else if (this.inputKeys.W.isDown && playerInWater)
		{
			this.setVelocityY(-600);
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
}