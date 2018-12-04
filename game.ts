import 'phaser';

// Game configuration
const gameConfig: GameConfig = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
	},
    scene: <Phaser.Scenes.Settings.Config>{
		
	}	
};

const scene: Phaser.Scenes.Settings.Config = {
	
}

// Game settings
// TODO scale water properly
const aquariumHeight = 1000;

// Game world elements
let platforms;
let water = {
    level: 0.1
};
let bubbles;
let aquariums;

// Game livings
let player;
let octopus = {
    isReleased: false
};

// Game objects
let cursors;
let bubbles_emitter;

const game = new Phaser.Game(gameConfig);

// Phaser scene functions
function preload()
{
    this.load.image('background_planks', 'assets/background_planks.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('water', 'assets/water.png');
    this.load.image('foreground_glass', 'assets/foreground_glass.png');

    this.load.image('aquarium1', 'assets/aquarium_1.png');

    this.load.spritesheet('player', 'assets/player_xd.png', { frameWidth: 152, frameHeight: 89 });
    this.load.image('bubbles', 'assets/bubble_small.png');

    this.load.spritesheet('octopus', 'assets/octopus.png', { frameWidth: 180, frameHeight: 210 });
}

function create()
{
    // loading game world elements
    this.add.image(400, 300, 'background_planks');

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    platforms.create(600, 510, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');

    aquariums = this.physics.add.staticGroup();
    aquariums.create(80, 250 - 32, 'aquarium1');

    // loading game livings
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    octopus.sprite = this.physics.add.sprite(80, 250 - 32 - 100, 'octopus');
    octopus.sprite.setBounce(1);
    octopus.sprite.setCollideWorldBounds(true);
    octopus.sprite.disableBody(true, true);

    // loading game world elements
    water.texture = this.physics.add.staticImage(400, 535, 'water').setScale(2, 0.1);
    water.texture.alpha = 0.5;

    this.add.image(400, 300, 'foreground_glass');

    // input
    cursors = this.input.keyboard.createCursorKeys();

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
    bubbles = this.add.particles('bubbles');

    bubbles_emitter = bubbles.createEmitter({
        speed: 60,
        scale: { start: 1, end: 0 },
        blendMode: 'SCREEN',
        maxParticles: 10,
        accelerationY: -400
    });
    bubbles_emitter.startFollow(player);
    bubbles_emitter.stop();

    // collisions
    this.physics.add.collider(player, platforms);

    this.physics.add.collider(octopus.sprite, platforms);
    this.physics.add.collider(octopus.sprite, player);
}

function update()
{
    const playerInWater = this.physics.world.overlap(player, water.texture);
    // player movement
    if (cursors.left.isDown)
    {
        if (playerInWater)
        {
            player.setVelocityX(-60);
        }
        else
        {
            player.setVelocityX(-160);
        }

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        if (playerInWater)
        {
            player.setVelocityX(60);
        }
        else
        {
            player.setVelocityX(160);
        }

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
    else if (cursors.up.isDown && playerInWater)
    {
        player.setVelocityY(-60);
    }

    // player bubbles
    if (playerInWater)
    {
        bubbles_emitter.emitParticle();
    }

    // water level change
    if (water.texture.displayHeight <= aquariumHeight)
    {
        water.level += 0.01;
        water.texture.setScale(2, water.level).refreshBody();
    }

    // aquariums releases
    if (this.physics.world.overlap(water.texture, aquariums) && !octopus.isReleased)
    {
        octopus.isReleased = true;
        octopus.sprite.enableBody(true, 80, 250 - 32 - 100, true, true);
        octopus.sprite.setVelocity(50, 20);
    }
    if (octopus.sprite.visible)
    {
        octopus.sprite.anims.play('life', true);
    }
}