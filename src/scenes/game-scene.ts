
import { LightStickEmitter } from '../LightStickEmitter';
import { Octopus } from '../Octopus';
import { Aquarium } from '../Aquarium';
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

	private waterGoUp: boolean = true;

	// Game world elements
	private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;	
	private aquarium: Aquarium;
	private water: Phaser.Physics.Arcade.Image;
	private hydrants: Phaser.Physics.Arcade.Sprite;
	private droplets: Phaser.Physics.Arcade.Group;

	// Game livings
	private player: Phaser.Physics.Arcade.Sprite;
	private octopus: Octopus;

	// Game objects
	private mainCamera: Phaser.Cameras.Scene2D.Camera;
	private inputKeys: {
		W: Phaser.Input.Keyboard.Key;
		S: Phaser.Input.Keyboard.Key;
		A: Phaser.Input.Keyboard.Key;
		D: Phaser.Input.Keyboard.Key;
		F: Phaser.Input.Keyboard.Key;
	};
	private playerDropletsCollider: Phaser.Physics.Arcade.Collider;
	private bubblesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	private lightStickEmitter: LightStickEmitter;

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
		this.load.image('droplet', ['../assets/droplet.png', '../assets/droplet_n.png']);
		this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
		
		this.load.spritesheet({
			key: 'hydrant',
			url: '../assets/hydrant.png',
			frameConfig: {
				frameWidth: 62,
				frameHeight: 101
			}
		});
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
	
		// loading game livings
		this.player =  this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'player');
		// this.player.setMass(1);
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true);
		//this.player.setPipeline('Light2D');

		this.octopus = new Octopus(this, 0, 0, 'octopus');
		this.octopus.setBounce(0);
		this.octopus.setCollideWorldBounds(true);
		this.octopus.setDefaultVelocity(300);
		this.octopus.setPlayer(this.player);
		(<any>this.octopus.body.allowGravity) = false;
		this.octopus.onPlayerCaught(() => this.playerCaught());
		this.hydrants = this.physics.add.sprite(this.gameWorldCenterX, this.gameWorldCenterY, 'hydrant');
		this.hydrants.setCollideWorldBounds(true);
		
		// particles
		let bubblesEmitterManager = this.add.particles('bubbles');

		this.bubblesEmitter = bubblesEmitterManager.createEmitter({
			speed: 60,
			scale: { start: 1, end: 0 },
			maxParticles: 10,
			accelerationY: -400,
		});
		this.bubblesEmitter.startFollow(this.player);
		this.bubblesEmitter.stop();
		
		this.lightStickEmitter = new LightStickEmitter(this, 'lightstick');
		this.lightStickEmitter.bubbleEmitterManager = bubblesEmitterManager;
		this.lightStickEmitter.bubbleEmitterConfig = {
			speed: 10,
			scale: { start: 0.5, end: 0 },
			accelerationY: -400,
			frequency: 400,
		};		
		this.octopus.setLightStickEmitter(this.lightStickEmitter);

		// loading game world elements
		this.water = this.physics.add.staticImage(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight, 'water');
		this.water.setDisplaySize(this.gameWorldWidth, 0);
		this.water.alpha = 0.5;
		this.water.setPipeline('Light2D');

		this.aquarium = new Aquarium(this, 1030, 800, 'aquarium1');
		this.aquarium.setPipeline('Light2D');
		this.aquarium.setWater(this.water);
		this.aquarium.setOctopus(this.octopus);	
	
		this.add.image(this.gameWorldCenterX, this.gameWorldCenterY, 'foreground_glass')
				.setDisplaySize(this.gameWorldWidth, this.gameWorldHeight);
				//.setPipeline('Light2D');

		// particles --> droplets
		this.droplets = this.physics.add.group();
		for (var i = 0; i < 500; i++)
		{
			let randomX: number = Phaser.Math.Between(0, this.gameWorldWidth);
			let randomY: number = Phaser.Math.Between(0, this.gameWorldHeight);

			let droplet: Phaser.Physics.Arcade.Sprite  = this.droplets.create(randomX, this.water.y, 'droplet');
			
			// let droplet = this.physics.add.sprite(randomX, randomY, 'droplet');
	
			// Enable physics for the droplet
			// this.game.physics.p2.enable(droplet);
			droplet.setCollideWorldBounds(true);
	
			// Add a force that slows down the droplet over time
			droplet.setDamping(false); //).body.damping = 0.3;

			droplet.setMass(3);
			droplet.setBounce(1);
			droplet.setAlpha(0.3);
			// droplet.setGravity(0, 1);
			droplet.setBlendMode(Phaser.BlendModes.ADD);
			// This makes the collision body smaller so that the droplets can get
			// really up close and goopy
			droplet.setCircle(droplet.width * 0.3); //.body.setCircle(droplet.width * 0.3);

			droplet.setPipeline('Light2D');
	
			// Add the droplet to the fluid group
			// droplet.setPipeline('Blur');

			// (<any>droplet.body.allowGravity) = false;
		}
		/* var blurShader = this.game.add.filter('Blur');
		blurShader.blur = 32;
		var threshShader = this.game.add.filter('Threshold');
		this.fluid.filters = [ blurShader, threshShader ];
		this.fluid.filterArea = this.game.camera.view; */
			// Add WebGL shaders to "liquify" the droplets
		// this.addShaders();
	
		// input
		this.inputKeys = {
			W: this.input.keyboard.addKey('W'),
			S: this.input.keyboard.addKey('S'),
			A: this.input.keyboard.addKey('A'),
			D: this.input.keyboard.addKey('D'),
			F: this.input.keyboard.addKey('F')
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

		this.anims.create({
			key: 'hydrant_turn',
			frames: [ { key: 'hydrant', frame: 1 } ]
		});
	
		// collisions
		this.physics.world.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);

		this.worldLayer.setCollisionByProperty({ collides: true });
		this.physics.add.collider(this.player, this.worldLayer);
		this.physics.add.collider(this.octopus, this.worldLayer);
		//this.physics.add.collider(this.octopus, this.player);
		this.physics.add.collider(this.hydrants, this.worldLayer);
		// this.physics.add.collider(this.droplets, this.worldLayer);
		this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);
		// this.physics.add.collider(this.water, this.droplets);

		// camera
		this.mainCamera = this.cameras.main;
		this.mainCamera.startFollow(this.player);
		this.mainCamera.setBounds(0, 0, this.gameWorldWidth, this.gameWorldHeight);

		// keyboard
		this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);
	}

	update(time: number, delta: number): void
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

		// player actions
		if (this.physics.world.overlap(<any>this.player, <any>this.hydrants) && this.inputKeys.F.isDown && this.waterGoUp)
		{
			this.waterGoUp = false;
		}
	
		// player bubbles
		if (playerInWater)
		{
			this.bubblesEmitter.emitParticle();
		}
	
		// water level change
		if (this.water.displayHeight <= this.waterHeightLimit && this.waterGoUp)
		{
			this.water.setDisplaySize(this.water.displayWidth, this.water.displayHeight + 0.1).refreshBody();
			this.water.setPosition(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight - (this.water.displayHeight / 2));
		}
		else if (this.water.displayHeight > 0 && !this.waterGoUp)
		{
			this.water.setDisplaySize(this.water.displayWidth, this.water.displayHeight - 1).refreshBody();
			this.water.setPosition(this.gameWorldCenterX, this.gameWorldHeight - this.groundHeight - (this.water.displayHeight / 2));
		}

		// droplets
		// console.log('water: ' + (this.water.y - (this.water.displayHeight / 2)));
		this.droplets.getChildren().forEach((d, i, arr) => {
			// console.log('droplet: ' + (d as Phaser.Physics.Arcade.Sprite).y);
			let droplet = <Phaser.Physics.Arcade.Sprite>d;
			if ((d as Phaser.Physics.Arcade.Sprite).y > this.water.y - (this.water.displayHeight / 2))
			{
				// console.log('setVelocity');
				/* this.physics.accelerateTo(d, (d as Phaser.Physics.Arcade.Sprite).x, this.water.y - (this.water.displayHeight / 2), 450, 500, 500); */
				// (d as Phaser.Physics.Arcade.Sprite).setBlendMode(3);
				(d as Phaser.Physics.Arcade.Sprite).setVelocityY(-100);
			}
			/* else
			{
				(d as Phaser.Physics.Arcade.Sprite).setVelocityY(0);
			} */
			let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y,
                droplet.x, droplet.y);
			if (dist < 100)
			{
				if (droplet.x > this.player.x)
				{
					droplet.setVelocityX(50);
				}
				else
				{
					droplet.setVelocityX(-50);
				}
			}
		});
		if (this.player.y <  this.water.y - (this.water.displayHeight / 2))
		{
			// this.playerDropletsCollider.destroy();
			this.playerDropletsCollider.active = false;
		}
		else
		{
			this.playerDropletsCollider.active = true;
			// this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);
		}
	
		// hydrants
		this.hydrants.anims.play('hydrant_turn');		

		// update objects
		this.octopus.update(time, delta);
		this.aquarium.update(time, delta);
		this.lightStickEmitter.update(time, delta);
	}

	throwLightStick(): void
	{
		var relativePlayerX = this.mainCamera.centerX;
		var relativePlayerY = this.mainCamera.centerY;

		relativePlayerX += this.player.x- this.mainCamera.midPoint.x;
		relativePlayerY += this.player.y - this.mainCamera.midPoint.y;

		var throwAngle = Phaser.Math.Angle.Between(
			relativePlayerX, relativePlayerY,
			this.input.activePointer.x, this.input.activePointer.y);

		let lightStick = this.lightStickEmitter.throw(this.player.x, this.player.y, throwAngle);

		this.physics.add.collider(lightStick, this.worldLayer);
		//this.physics.add.collider(lightStick, this.player);
		this.physics.add.collider(lightStick, this.octopus);
	}

	playerCaught(): void
	{
		console.log("Fuck!");
		//this.player.setTint(Phaser.Math.Between(0x7f7f7f, 0xffffff));
		this.player.disableBody(true, true);
	}
}
