
export class GameScene extends Phaser.Scene
{
	// Game settings
	private gameWorldWidth: number = 2080;
	private gameWorldHeight: number = 1280;
	private gameWorldCenterX: number = this.gameWorldWidth / 2;
	private gameWorldCenterY: number = this.gameWorldHeight / 2;

	private groundHeight: number = 4 * 32;
	private waterHeightLimit: number = this.gameWorldHeight - this.groundHeight - 100;

	// Game world elements
	private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;	
	private aquariums: Phaser.Physics.Arcade.StaticGroup;
	private water: Phaser.Physics.Arcade.Image;

	// Game livings
	private player: Phaser.Physics.Arcade.Sprite;
	private octopus: Phaser.Physics.Arcade.Sprite;

	// Game objects
	private mainCamera: Phaser.Cameras.Scene2D.Camera;
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
		this.load.image("tiles", "../assets/world_tails.png");
		this.load.tilemapTiledJSON("map", "../assets/game_map.json");

		this.load.image('background_planks', '../assets/background_planks.png');
		this.load.image('aquarium1', '../assets/aquarium_1.png');
		this.load.image('bubbles', '../assets/bubble_small.png');
		this.load.image('water', '../assets/water.png');
		this.load.image('foreground_glass', '../assets/foreground_glass.png');
	
		this.load.spritesheet('player', '../assets/player_xd.png', { frameWidth: 152, frameHeight: 89 });
		this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
	}

	create(): void
	{	
		// loading game world elements
		this.add.tileSprite(this.gameWorldCenterX, this.gameWorldCenterY, this.gameWorldWidth, this.gameWorldHeight, 'background_planks');

		// loading game map
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("world_tails", "tiles");
		this.worldLayer = map.createStaticLayer("World", tileset, 0, 0);
	
		this.aquariums = this.physics.add.staticGroup();
		this.aquariums.create(80, 250 - 32, 'aquarium1');
	
		// loading game livings
		this.player = this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'player');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		this.octopus = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
		this.octopus.setBounce(1);
		this.octopus.setCollideWorldBounds(true);
		this.octopus.disableBody(true, true);
	
		// loading game world elements
		this.water = this.physics.add.staticImage(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight, 'water');
		this.water.setDisplaySize(this.gameWorldWidth, 0);
		this.water.alpha = 0.5;
	
		this.add.image(this.gameWorldCenterX, this.gameWorldCenterY, 'foreground_glass').setDisplaySize(this.gameWorldWidth, this.gameWorldHeight);
	
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
	
			// animations -> particles
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
		this.physics.world.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);

		this.worldLayer.setCollisionByProperty({ collides: true });
		this.physics.add.collider(this.player, this.worldLayer);
		this.physics.add.collider(this.octopus, this.worldLayer);
		this.physics.add.collider(this.octopus, this.player);

		// camera
		this.mainCamera = this.cameras.main;
		this.mainCamera.startFollow(this.player);
		this.mainCamera.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);
	}

	update(): void
	{
		const playerInWater: boolean = this.physics.world.overlap(<any>this.player, <any>this.water);
		// player movement
		if (this.cursors.left.isDown)
		{
			if (playerInWater)
			{
				this.player.setVelocityX(-600);
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
				this.player.setVelocityX(600);
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
	
			// player movement -> player jump
		if (this.cursors.up.isDown && this.player.body.blocked.down)
		{
			this.player.setVelocityY(-330);
		}
		else if (this.cursors.up.isDown && playerInWater)
		{
			this.player.setVelocityY(-600);
		}
	
		// player bubbles
		if (playerInWater)
		{
			this.bubblesEmitter.emitParticle();
		}
	
		// water level change
		if (this.water.displayHeight <= this.waterHeightLimit)
		{
			this.water.setDisplaySize(this.water.displayWidth, this.water.displayHeight + 1).refreshBody();
			this.water.setPosition(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight - (this.water.displayHeight / 2));
		}
	
		// aquariums release monsters :o
		if (this.physics.world.overlap(<any>this.water, <any>this.aquariums) && !this.octopus.body.enable)
		{
			this.octopus.enableBody(true, 80, 250 - 32 - 100, true, true);
			this.octopus.setVelocity(50, 20);
		}
		if (this.octopus.body.enable)
		{
			this.octopus.anims.play('life', true);
		}
	}
}
