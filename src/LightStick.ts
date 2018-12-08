
export class LightStick extends Phaser.Physics.Arcade.Sprite
{
    public light: Phaser.GameObjects.Light;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: number | string)
    {
        super(scene, x, y, texture, frame);

        scene.physics.add.sys.displayList.add(this);
        scene.physics.add.sys.updateList.add(this);
        scene.physics.add.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

        //this.disableBody(true, true);
    }
}