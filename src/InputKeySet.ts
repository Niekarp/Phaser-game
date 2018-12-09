
export class InputKeySet
{
	public W: Phaser.Input.Keyboard.Key;
	public S: Phaser.Input.Keyboard.Key;
	public A: Phaser.Input.Keyboard.Key;
	public D: Phaser.Input.Keyboard.Key;
	public F: Phaser.Input.Keyboard.Key;

	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene)
	{
		this.scene = scene;
	}

	public addAllKeys()
	{
		this.W = this.scene.input.keyboard.addKey('W');
		this.S = this.scene.input.keyboard.addKey('S');
		this.A = this.scene.input.keyboard.addKey('A');
		this.D = this.scene.input.keyboard.addKey('D');
		this.F = this.scene.input.keyboard.addKey('F');
	}
}