
import { LightStick } from '../LightStick';

export class GameScene extends Phaser.Scene
{
	// Lights
	private playerLight: Phaser.GameObjects.Light;
	private octopusLight: Phaser.GameObjects.Light;

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
	private inputKeys: {
		W: Phaser.Input.Keyboard.Key;
		S: Phaser.Input.Keyboard.Key;
		A: Phaser.Input.Keyboard.Key;
		D: Phaser.Input.Keyboard.Key;
	};
	private bubblesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

	private lightSticks = [];

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
		this.load.image("tiles", ["../assets/world_tails.png", "../assets/world_tails_n.png"]);
		this.load.tilemapTiledJSON("map", "../assets/game_map.json");

		this.load.image('background_planks', ['../assets/background_planks.png',  '../assets/background_planks_n.png']);
		this.load.image('aquarium1', ['../assets/aquarium_1.png', '../assets/aquarium_1_n.png']);
		this.load.image('bubbles', '../assets/bubble_small.png');
		this.load.image('lightstick', '../assets/lightstick.png');
		this.load.image('water', ['../assets/water.png', '../assets/water_n.png']);
		this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
	
		//this.load.spritesheet('player', ['../assets/player_xd.png', '../assets/player_xd_n.png'], { frameWidth: 152, frameHeight: 89 });
		this.load.spritesheet({
			key: 'player',
			url: '../assets/player_xd.png',
			normalMap: '../assets/player_xd_n.png',
			frameConfig: {
				frameWidth: 152,
				frameHeight: 89
			}
		});
		this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
	}

	create(): void
	{	
		// light
		this.lights.enable().setAmbientColor(0x000000);
		this.playerLight = this.lights.addLight(this.gameWorldCenterX, this.gameWorldCenterY, 200).setIntensity(0.5);
		this.octopusLight = this.lights.addLight(this.gameWorldCenterX, this.gameWorldCenterY, 150).setIntensity(0.5);

		// loading game world elements
		this.add.tileSprite(this.gameWorldCenterX, this.gameWorldCenterY, this.gameWorldWidth, this.gameWorldHeight, 'background_planks')
				.setPipeline('Light2D');

		// loading game map
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("world_tails", "tiles");
		this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');
	
		this.aquariums = this.physics.add.staticGroup();
		this.aquariums.create(80, 250 - 32, 'aquarium1').setPipeline('Light2D');
	
		// loading game livings
		this.player = this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'player');
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		//this.player.setPipeline('Light2D');

		this.octopus = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
		this.octopus.setBounce(1);
		this.octopus.setCollideWorldBounds(true);
		this.octopus.disableBody(true, true);
	
		// loading game world elements
		this.water = this.physics.add.staticImage(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight, 'water');
		this.water.setDisplaySize(this.gameWorldWidth, 0);
		this.water.alpha = 0.5;
		this.water.setPipeline('Light2D');
	
		this.add.image(this.gameWorldCenterX, this.gameWorldCenterY, 'foreground_glass')
				.setDisplaySize(this.gameWorldWidth, this.gameWorldHeight);
				//.setPipeline('Light2D');
	
		// input
		this.inputKeys = {
			W: this.input.keyboard.addKey('W'),
			S: this.input.keyboard.addKey('S'),
			A: this.input.keyboard.addKey('A'),
			D: this.input.keyboard.addKey('D')
		};
	
		// animations
		this.anims.create({
			key: 'left',
			frames: [ { key: 'player', frame: 0 } ],
			frameRate: 10,
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

		// keyboard
		this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);
	}

	update(): void
	{
		// update lights
		this.playerLight.setPosition(this.player.x, this.player.y);
		this.octopusLight.setPosition(this.octopus.x, this.octopus.y);

		const playerInWater: boolean = this.physics.world.overlap(<any>this.player, <any>this.water);
		// player movement
		if (this.inputKeys.A.isDown)
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
		else if (this.inputKeys.D.isDown)
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
		if (this.inputKeys.W.isDown && this.player.body.blocked.down)
		{
			this.player.setVelocityY(-330);
		}
		else if (this.inputKeys.W.isDown && playerInWater)
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

		// sticks
		this.lightSticks.forEach(function(lightStick : Phaser.Physics.Arcade.Sprite) {
			if(!lightStick.body.blocked.down) 
			{
				lightStick.angle += 10;				
			}
			else
			{
				lightStick.setDragX(500);
			}
			(<Phaser.GameObjects.Light>(<any>lightStick).light).x = lightStick.x;
			(<Phaser.GameObjects.Light>(<any>lightStick).light).y = lightStick.y;
		});
	}

	throwLightStick(): void
	{
		var relativePlayerX = this.mainCamera.centerX;
		var relativePlayerY = this.mainCamera.centerY;

		relativePlayerX += this.player.x- this.mainCamera.midPoint.x;
		relativePlayerY += this.player.y - this.mainCamera.midPoint.y;

		var lightColor = Phaser.Math.Between(0xaaaaaa, 0xffffff);
		var throwAngle = Phaser.Math.Angle.Between(
			relativePlayerX, relativePlayerY,
			this.input.activePointer.x, this.input.activePointer.y);

		var lightStick = this.physics.add.sprite(this.player.x, this.player.y, 'lightstick');
		lightStick.setVelocity(400 * Math.cos(throwAngle),
			400 * Math.sin(throwAngle));
		lightStick.setScale(0.4);
		lightStick.angle = Phaser.Math.FloatBetween(0, 180);
		lightStick.setCollideWorldBounds(true);
		(<any>lightStick).light = this.lights.addLight(lightStick.x, lightStick.y, 400)
				.setIntensity(2)
				.setColor(lightColor);
		lightStick.setTint(lightColor);
		
		if(this.lights.lights.length > this.lights.maxLights)
		{
			let light = (<Phaser.GameObjects.Light>(<any>this.lightSticks[0]).light);
			this.lights.removeLight(light);
			(<Phaser.Physics.Arcade.Sprite>this.lightSticks[0]).destroy();
			this.lightSticks.shift();
		}
		
		this.lightSticks.push(lightStick);

		this.physics.add.collider(lightStick, this.worldLayer);
		//this.physics.add.collider(lightStick, this.player);
		this.physics.add.collider(lightStick, this.octopus);
	}
}
