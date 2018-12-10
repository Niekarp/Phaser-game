
export class Hydrant extends Phaser.Physics.Arcade.Image
{
	private opened: boolean = false;
	private waterEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
	{
		super(scene, x, y, texture, frame);

		scene.physics.add.sys.displayList.add(this);
		scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);

		this.disableBody(true, true);
	}

	public isOpen(): boolean
	{
		return this.opened;
	}

	public open(): void
	{
		this.opened = true;
		this.waterEmitter.start();
	}

	public close(): void
	{
		this.opened = false;
		this.waterEmitter.stop();
	}

	public setWaterEmitter(waterEmitter: Phaser.GameObjects.Particles.ParticleEmitter): void
	{
		this.waterEmitter = waterEmitter;
	}
}