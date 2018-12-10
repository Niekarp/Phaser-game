
import { LightStickEmitter } from '../LightStickEmitter';
import { Octopus } from '../Octopus';
import { Aquarium } from '../Aquarium';
import { LightStick } from '../LightStick';
import { Player } from '../Player';
import { InputKeySet } from '../InputKeySet';
import { WorldDimensions } from '../WorldDimensions';
import { Water, WaterMovementDirection } from '../Water';
import { Hydrant } from '../Hydrant';

export class GameScene extends Phaser.Scene
{
	// Game settings
	private gameWorldDimensions: WorldDimensions;
	private hydrantCount: number = 10;
	private openHydrants: number = this.hydrantCount;
	private dropletsCount: number = 200;
	private dropletsVisible: boolean;

	// Game world elements
	private worldLayer: Phaser.Tilemaps.StaticTilemapLayer;	
	private aquarium: Aquarium;
	private water: Water;
	private hydrants: Phaser.Physics.Arcade.StaticGroup;
	private hydrantMen: Phaser.Physics.Arcade.Group;
	private droplets: Phaser.Physics.Arcade.Group;

	// Game livings
	private player: Player;
	private octopus: Octopus;

	// Game objects
	private mainCamera: Phaser.Cameras.Scene2D.Camera;
	private inputKeys: InputKeySet;
	private playerDropletsCollider: Phaser.Physics.Arcade.Collider;
	private bubblesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	// private waterEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
	private lightStickEmitter: LightStickEmitter;

	// Lights
	private playerLight: Phaser.GameObjects.Light;
	private octopusLight: Phaser.GameObjects.Light;

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
	/*
	_____          _                 _ 
	|  __ \        | |               | |
	| |__) | __ ___| | ___   __ _  __| |
	|  ___/ '__/ _ \ |/ _ \ / _` |/ _` |
	| |   | | |  __/ | (_) | (_| | (_| |
	|_|   |_|  \___|_|\___/ \__,_|\__,_|
										
										   
	*/
	preload(): void
	{
		this.load.image("tiles", ["../assets/world_tails.png", "../assets/world_tails_n.png"]);
		this.load.tilemapTiledJSON("map", "../assets/game_map.json");

		this.load.image('background_planks', ['../assets/background_planks.png',  '../assets/background_planks_n.png']);

		this.load.image('water', ['../assets/water.png', '../assets/water_n.png']);
		this.load.image('aquarium1', ['../assets/aquarium_1.png', '../assets/aquarium_1_n.png']);
		this.load.image('hydrant1', [ '../assets/hydrant_1.png', '../assets/hydrant_1_n.png' ]);

		this.load.image('lightstick', '../assets/lightstick.png');
		this.load.image('bubbles', '../assets/bubble_small.png');
		this.load.image('droplet', ['../assets/droplet.png', '../assets/droplet_n.png']);

		this.load.image('foreground_glass', ['../assets/foreground_glass.png', '../assets/foreground_glass_n.png']);
		
		this.load.spritesheet({
			key: 'player',
			url: '../assets/player_xd.png',
			frameConfig: {
				frameWidth: 152,
				frameHeight: 89
			}
		});
		this.load.spritesheet('octopus', '../assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
	}

	/*
	_____                _       
	/ ____|              | |      
   | |     _ __ ___  __ _| |_ ___ 
   | |    | '__/ _ \/ _` | __/ _ \
   | |____| | |  __/ (_| | ||  __/
	\_____|_|  \___|\__,_|\__\___|
								  
								  
	*/
	create(): void
	{	
		// === INITIAL CONFIGURATION ===
		
		// configure world dimensions
		this.gameWorldDimensions = new WorldDimensions();
		this.gameWorldDimensions.worldWidth = 2080;
		this.gameWorldDimensions.worldHeight = 1280;
		this.gameWorldDimensions.worldCenterX = this.gameWorldDimensions.worldWidth / 2;
		this.gameWorldDimensions.worldCenterY = this.gameWorldDimensions.worldHeight / 2;
		this.gameWorldDimensions.groundHeight = 4 * 32;

		// input
		this.inputKeys = new InputKeySet(this);
		this.inputKeys.addAllKeys();
		this.input.keyboard.on('keydown_SPACE', this.throwLightStick, this);

		// ===


		// === CREATING OBJECTS ===		
		
		// background
		this.add.tileSprite(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight, 'background_planks')
				.setPipeline('Light2D');

		//  game map
		const map = this.make.tilemap({ key: "map" });
		const tileset = map.addTilesetImage("world_tails", "tiles");
		this.worldLayer = map.createStaticLayer("World", tileset, 0, 0).setPipeline('Light2D');

		// dead objects
		this.aquarium = new Aquarium(this, 1030, 970, 'aquarium1');
		this.hydrants = this.physics.add.staticGroup();
		for(let i: number = 0; i < this.hydrantCount; ++i)
		{
			let hydrant: Hydrant = new Hydrant(this, 0, 0, 'hydrant1');
			this.hydrants.add(hydrant);
		}
		this.hydrantMen = this.physics.add.group();
		for(let i: number = 0,
			sectorWidth: number = this.gameWorldDimensions.worldWidth / this.hydrantCount,
			currentSectorBegin: number = 0
			; i < this.hydrantCount; ++i)
		{
			let randomX = Phaser.Math.Between(currentSectorBegin, currentSectorBegin + sectorWidth);
			this.hydrantMen.create(randomX, 0, 'hydrant1');

			currentSectorBegin += sectorWidth;
			/* let randomX: number = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);
			this.hydrantMen.create(randomX, this.gameWorldDimensions.worldCenterY, 'hydrant1'); */
		}
		this.lightStickEmitter = new LightStickEmitter(this, 'lightstick');

		// alive objects
		this.player = new Player(this, 0, 0, 'player');
		this.octopus = new Octopus(this, 0, 0, 'octopus');
		this.water = new Water(this, 0, 0, 'water');

		// particles
		let bubblesEmitterManager = this.add.particles('bubbles');
		this.bubblesEmitter = bubblesEmitterManager.createEmitter({
			speed: 60,
			scale: { start: 1, end: 0 },
			maxParticles: 10,
			accelerationY: -400,
		});
		let waterEmitterManager = this.add.particles('droplet');

		// foreground
		this.add.image(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 'foreground_glass')
				.setDisplaySize(this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);

		// ===
	
		// === INITIALIZE OBJECTS ===

		// loading game livings
		this.player.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY);
		this.player.setWater(this.water);
		this.player.setBubbleEmitter(this.bubblesEmitter);
		this.player.setInputKeySet(this.inputKeys);
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true);

		this.octopus.setBounce(0);
		this.octopus.setCollideWorldBounds(true);
		this.octopus.setDefaultVelocity(300);
		this.octopus.setPlayer(this.player);
		(<any>this.octopus.body.allowGravity) = false;
		this.octopus.onPlayerCaught(() => this.playerCaught());

		// loading game world elements
		this.water.setPosition(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight);
		this.water.setWaterHeightLimit(this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight - 100);
		this.water.setWaterMovementDirection(WaterMovementDirection.Up);
		this.water.setWorldDimensions(this.gameWorldDimensions);
		this.water.setDisplaySize(this.gameWorldDimensions.worldWidth, 0);
		this.water.alpha = 0.5;
		this.water.setPipeline('Light2D');

		this.aquarium.setPipeline('Light2D');
		this.aquarium.setWater(this.water);
		this.aquarium.setOctopus(this.octopus);	

		this.hydrants.getChildren().forEach((hydrant: Hydrant) => {
			let waterEmitter = waterEmitterManager.createEmitter({
				speed: 60,
				scale: { start: 1, end: 0 },
				maxParticles: 50,
				accelerationY: 400,
				alpha: 0.2
			});
			waterEmitter.startFollow(hydrant);
			hydrant.setWaterEmitter(waterEmitter);
			hydrant.open();
			hydrant.setPipeline('Light2D');
		});

		// light
		this.lights.enable().setAmbientColor(0x000000);
		this.playerLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 200).setIntensity(0.5);
		this.octopusLight = this.lights.addLight(this.gameWorldDimensions.worldCenterX, this.gameWorldDimensions.worldCenterY, 150).setIntensity(0.5);

		// particles
		/* this.bubblesEmitter.setSpeed(60);
		this.bubblesEmitter.setScale({ start: 1, end: 0 });
		this.bubblesEmitter.maxParticles = 10;
		this.bubblesEmitter.accelerationY = <Phaser.GameObjects.Particles.EmitterOp>{ propertyKey: 'accelerationY', propertyValue: -400 }; */
		this.bubblesEmitter.startFollow(this.player);
		this.bubblesEmitter.stop();
		
		this.lightStickEmitter.bubbleEmitterManager = bubblesEmitterManager;
		this.lightStickEmitter.bubbleEmitterConfig = {
			speed: 10,
			scale: { start: 0.5, end: 0 },
			accelerationY: -400,
			frequency: 400,
		};		
		this.lightStickEmitter.water = this.water;
		this.octopus.setLightStickEmitter(this.lightStickEmitter);

		// particles --> droplets
		this.droplets = this.physics.add.group();
		for (var i = 0; i < this.dropletsCount; i++)
		{
			let randomX: number = Phaser.Math.Between(0, this.gameWorldDimensions.worldWidth);

			let droplet: Phaser.Physics.Arcade.Sprite  = this.droplets.create(randomX, this.water.y, 'droplet');

			droplet.setCollideWorldBounds(true);
			droplet.setDamping(false);
			droplet.setMass(1.5);
			droplet.setBounce(1);
			droplet.setAlpha(0.3);
			droplet.setBlendMode(Phaser.BlendModes.ADD);
			droplet.setCircle(droplet.width * 0.3);
			droplet.setPipeline('Light2D');

			droplet.disableBody(true, true);
			this.dropletsVisible = false;
		}
		// ===

		// === OTHER ===
	
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
	
		// collisions
		this.physics.world.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);

		this.worldLayer.setCollisionByProperty({ collides: true });
		this.physics.add.collider(this.player, this.worldLayer);
		this.physics.add.collider(this.octopus, this.worldLayer);
		this.physics.add.collider(this.hydrants, this.worldLayer);
		this.hydrantMen.getChildren().forEach((hMan, idx) => {
			let correspondingHydrant = <Hydrant>this.hydrants.getChildren()[idx];

			this.physics.add.collider(hMan, this.worldLayer, (hydrantMan: Phaser.Physics.Arcade.Image, wl) => {
				this.hydrantHydrantManCollide(correspondingHydrant, hydrantMan);
			});

			this.physics.add.overlap(correspondingHydrant, this.player, (hydrant: Hydrant, player: Player) => {
				this.hydrantPlayerOverlap(hydrant, player);
			});
		});
		this.playerDropletsCollider = this.physics.add.collider(this.player, this.droplets);

		// camera
		this.mainCamera = this.cameras.main;
		this.mainCamera.startFollow(this.player);
		this.mainCamera.setBounds(0, 0, this.gameWorldDimensions.worldWidth, this.gameWorldDimensions.worldHeight);

		// ===
	}

	/*
	_    _           _       _       
	| |  | |         | |     | |      
	| |  | |_ __   __| | __ _| |_ ___ 
	| |  | | '_ \ / _` |/ _` | __/ _ \
	| |__| | |_) | (_| | (_| | ||  __/
	 \____/| .__/ \__,_|\__,_|\__\___|
		   | |                        
		   |_|                        
								  
								  
	*/
	update(time: number, delta: number): void
	{
		// lights
		this.playerLight.setPosition(this.player.x, this.player.y);
		this.octopusLight.setPosition(this.octopus.x, this.octopus.y);

		// droplets
		this.updateDroplets();
		this.checkPlayerOverDroplets();
		this.dropletsCheckWaterLevel();
	
		// update objects
		this.player.update(time, delta);
		this.water.update(time, delta);
		this.octopus.update(time, delta);
		this.aquarium.update(time, delta);
		this.lightStickEmitter.update(time, delta);
	}

	/* 
	____  _   _               
	/ __ \| | | |              
   | |  | | |_| |__   ___ _ __ 
   | |  | | __| '_ \ / _ \ '__|
   | |__| | |_| | | |  __/ |   
	\____/ \__|_| |_|\___|_|   
							   
								
	*/
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

	hydrantHydrantManCollide(hydrant: Hydrant, hydrantMan: Phaser.Physics.Arcade.Image): void
	{
		hydrant.enableBody(false, 0, 0, true, true);
		hydrant.setPosition(hydrantMan.x, hydrantMan.y).refreshBody();

		hydrantMan.disableBody(true, true);
	}
	
	hydrantPlayerOverlap(hydrant: Hydrant, player: Player)
	{
		if (this.inputKeys.F.isDown 
			&& hydrant.isOpen()
			&& this.water.getWaterMovementDirection() == WaterMovementDirection.Up)
		{
			hydrant.close();
			this.openHydrants -= 1;
			if (this.openHydrants == 0)
			{
				this.water.setWaterMovementDirection(WaterMovementDirection.Down);
			}
		}
	}

	updateDroplets()
	{
		// droplets
		this.droplets.getChildren().forEach((d, i, arr) => 
		{
			let droplet = <Phaser.Physics.Arcade.Sprite>d;
			if (droplet.y > this.water.y - (this.water.displayHeight / 2))
			{ 
				droplet.setVelocityY(-100);
			}

			let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y,
				droplet.x, droplet.y);
			let distX = Math.sqrt((this.player.x - droplet.x)**2);
				
			if (dist < 50)
			{
				if (droplet.x > this.player.x)
				{
					droplet.setVelocityX(30);
				}
				else
				{
					droplet.setVelocityX(-30);
				}
			}
			else if (distX > this.mainCamera.displayWidth / 2
					&& this.player.x < this.gameWorldDimensions.worldWidth - this.mainCamera.displayWidth / 2
					&& this.player.x > this.mainCamera.displayWidth / 2)
			{
				let newX = Phaser.Math.Between(this.player.x - this.mainCamera.displayWidth / 2, this.player.x + this.mainCamera.displayWidth / 2, );

				droplet.setPosition(newX, droplet.y);
			}
		});
	}

	checkPlayerOverDroplets()
	{
		if (this.player.y <  this.water.y - (this.water.displayHeight / 2))
		{
			this.playerDropletsCollider.active = false;
		}
		else
		{
			this.playerDropletsCollider.active = true;
		}
	}

	dropletsCheckWaterLevel()
	{
		// console.log('water: ' + this.water.getCurrentY() + ' > '+ )
		let littleOverGround: number = this.gameWorldDimensions.worldHeight - this.gameWorldDimensions.groundHeight - 100;

		if (this.water.getCurrentY() > littleOverGround && this.dropletsVisible)
		{
			this.droplets.getChildren().forEach((droplet: Phaser.Physics.Arcade.Sprite) => {
				droplet.disableBody(true, true);
			});
			this.dropletsVisible = false;
		}
		else if (this.water.getCurrentY() < littleOverGround && !this.dropletsVisible)
		{
			this.droplets.getChildren().forEach((droplet: Phaser.Physics.Arcade.Sprite) => {
				droplet.enableBody(false, -100, - 100, true, true);
			});
			this.dropletsVisible = true;
		}
	}
}
