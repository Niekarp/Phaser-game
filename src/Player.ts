

export class Player extends Phaser.Physics.Arcade.Sprite
{

	private water: Phaser.Physics.Arcade.Image;

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
	}


}