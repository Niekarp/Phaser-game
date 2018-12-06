
export class GameScene extends Phaser.Scene
{
	// Game settings
		// TODO scale water properly
	private waterHeightLimit: number = 1000;

	// Game world elements
	private platforms: Phaser.Physics.Arcade.StaticGroup;
	private aquariums: Phaser.Physics.Arcade.StaticGroup;
	private water = {
		// represents the scale by which the water image is multiplied
		level: 0.1,
		object: <Phaser.Physics.Arcade.Image>null
	};

	// Game livings
	private player: Phaser.Physics.Arcade.Sprite;
	private octopus = {
		isReleased: false,
		object: <Phaser.Physics.Arcade.Sprite>null
	};

	// Game objects
	private cursors: Phaser.Input.Keyboard.CursorKeys;
	private bubblesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	constructor()
	{
		super(
			<Phaser.Scenes.Settings.Config>
			{
				key: "GameScene"
			}
		);
	}

	// Phaser scene functions
	preload(): void
	{
		this.load.image('background_planks', '../assets/background_planks.png');
		this.load.image('platform', '../assets/platform.png');
		this.load.image('water', '../assets/water.png');
		this.load.image('foreground_glass', '../assets/foreground_glass.png');
	
		this.load.image('aquarium1', '../assets/aquarium_1.png');
	
		this.load.spritesheet('player', '../assets/player_xd.png', { frameWidth: 152, frameHeight: 89 });
		this.load.image('bubbles', '../assets/bubble_small.png');
	
		this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
	};;;

	create(): void
	{
		// loading game world elements
		this.add.image(400, 300, 'background_planks');

		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
		this.platforms.create(600, 510, 'platform');
		this.platforms.create(50, 250, 'platform');
		this.platforms.create(750, 220, 'platform');
	
		this.aquariums = this.physics.add.staticGroup();
		this.aquariums.create(80, 250 - 32, 'aquarium1');
	
		// loading game livings
		this.player = this.physics.add.sprite(100, 450, 'player');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
	
		this.octopus.object = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
		this.octopus.object.setBounce(1);
		this.octopus.object.setCollideWorldBounds(true);
		this.octopus.object.disableBody(true, true);
	
		// loading game world elements
		this.water.object = this.physics.add.staticImage(400, 535, 'water');
		this.water.object.setScale(2, 1);
		this.water.object.setDisplaySize(this.water.object.width, 0);
		this.water.object.alpha = 0.5;
	
		this.add.image(400, 300, 'foreground_glass');
	
		// input
		this.cursors = this.input.keyboard.createCursorKeys();
	
		// animations
		this.anims.create({
			key: 'left',
			frames: [ { key: 'player', frame: 0 } ],
			frameRate: 10
		});
		this.anims.create({
			key: 'turn',
			frames: [ { key: 'player', frame: 1 } ],
			frameRate: 20
		});
		this.anims.create({
			key: 'right',
			frames: [ { key: 'player', frame: 2 } ],
			frameRate: 10
		});
	
		this.anims.create({
			key: 'life',
			frames: this.anims.generateFrameNumbers('octopus', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: -1
		});
	
			// animations: particles
		let bubblesEmitterManager = this.add.particles('bubbles');
	
		this.bubblesEmitter = bubblesEmitterManager.createEmitter({
			speed: 60,
			scale: { start: 1, end: 0 },
			maxParticles: 10,
			accelerationY: -400
		});
		this.bubblesEmitter.startFollow(this.player);
		this.bubblesEmitter.stop();
	
		// collisions
		this.physics.add.collider(this.player, this.platforms);
	
		this.physics.add.collider(this.octopus.object, this.platforms);
		this.physics.add.collider(this.octopus.object, this.player);
	}

	update(): void
	{
		// TODO: try to remove <any>
		const playerInWater: boolean = this.physics.world.overlap(<any>this.player, <any>this.water.object);
		// player movement
		if (this.cursors.left.isDown)
		{
			if (playerInWater)
			{
				this.player.setVelocityX(-60);
			}
			else
			{
				this.player.setVelocityX(-160);
			}
	
			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown)
		{
			if (playerInWater)
			{
				this.player.setVelocityX(60);
			}
			else
			{
				this.player.setVelocityX(160);
			}
	
			this.player.anims.play('right', true);
		}
		else
		{
			this.player.setVelocityX(0);
	
			this.player.anims.play('turn');
		}
	
		// player jump
		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-330);
		}
		else if (this.cursors.up.isDown && playerInWater)
		{
			this.player.setVelocityY(-60);
		}
	
		// player bubbles
		if (playerInWater)
		{
			this.bubblesEmitter.emitParticle();
		}
	
		// water level change
		if (this.water.object.displayHeight <= this.waterHeightLimit)
		{
			this.water.level += 1;
			// this.water.object.setScale(2, this.water.level).refreshBody();
			this.water.object.setDisplaySize(this.water.object.width*2, this.water.level).refreshBody();
		}
	
		// aquariums release monsters :o
		if (this.physics.world.overlap(<any>this.water.object, <any>this.aquariums) && !this.octopus.isReleased)
		{
			this.octopus.isReleased = true;
			this.octopus.object.enableBody(true, 80, 250 - 32 - 100, true, true);
			this.octopus.object.setVelocity(50, 20);
		}
		if (this.octopus.object.visible)
		{
			this.octopus.object.anims.play('life', true);
		}
	}
}
