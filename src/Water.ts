import { WorldDimensions } from "./WorldDimensions";

export enum WaterMovementDirection
{
	Up,
	Down,
	None
}

export class Water extends Phaser.Physics.Arcade.Image
{
	private waterHeightLimit: number;
	private waterMovementDirection: WaterMovementDirection;
	private worldDimensions: WorldDimensions;

	constructor (scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
	{
		super(scene, x, y, texture, frame);

		scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
		scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
	}

	public update(time: number, delta: number): void
	{
		super.update(time, this.data);

		// water level change
		if (this.displayHeight <= this.waterHeightLimit && this.waterMovementDirection == WaterMovementDirection.Up)
		{
			this.setDisplaySize(this.displayWidth, this.displayHeight + 0.1).refreshBody();
		}
		else if (this.displayHeight > 0 && this.waterMovementDirection == WaterMovementDirection.Down)
		{
			this.setDisplaySize(this.displayWidth, this.displayHeight - 1).refreshBody();
		}
		this.setPosition(this.worldDimensions.worldCenterX, this.worldDimensions.groundHeight - this.worldDimensions.groundHeight - (this.displayHeight / 2));
	}

	public setWaterHeightLimit(newLimit: number): void
	{
		this.waterHeightLimit = newLimit;
	}

	public setWaterMovementDirection(newDirection: WaterMovementDirection): void
	{
		this.waterMovementDirection = newDirection;
	}

	public setWorldDimensions(dimensions: WorldDimensions): void
	{
		this.worldDimensions = dimensions;
	}
}