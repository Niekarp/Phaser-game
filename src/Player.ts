import { InputKeySet } from "./InputKeySet";
import { Water } from "./Water";

export class Player extends Phaser.Physics.Arcade.Sprite
{
	private water: Water;
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

		// player movement
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
	
			this.anims.play('right', true);
		}
		else
		{
			this.setVelocityX(0);
	
			this.anims.play('turn');
		}
	
			// player movement -> player jump
		if (this.inputKeys.W.isDown && this.body.blocked.down)
		{
			this.setVelocityY(-330);
		}
		else if (this.inputKeys.W.isDown && playerInWater)
		{
			this.setVelocityY(-600);
		}

		/* // player actions
		if (this.scene.physics.world.overlap(<any>this, <any>this.hydrants) && this.inputKeys.F.isDown && this.waterGoUp)
		{
			this.waterGoUp = false;
		} */

		/* // player bubbles
		if (playerInWater)
		{
			this.bubblesEmitter.emitParticle();
		} */
	}

	public setWater(water: Water): void
	{
		this.water = water;
	}

	public setInputKeySet(inputKeys: InputKeySet)
	{
		this.inputKeys = inputKeys;
	}
}