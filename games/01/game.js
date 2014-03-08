var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var score = 0,
    scoreText;

var cursors, ground, platforms, player, spacebarKey, stars;

function preload() {
    game.load.image('sky', 'images/sky.png');
    game.load.image('ground', 'images/platform.png');
    game.load.image('star', 'images/star.png');
    game.load.spritesheet('dude', 'images/dude.png', 32, 48);
}

function create() {
    cursors = game.input.keyboard.createCursorKeys();

    spacebarKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    ground = game.add.sprite(0, game.world.height - 64, 'ground');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'ground');
 
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
 
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
 
    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
 
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(game.world.width-350, 150, 'ground');
    ledge.body.immovable = true;    

    stars = game.add.group();
 
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');
 
        //  Let gravity do its thing
        star.body.gravity.y = 400;
 
        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.4 + Math.random() * 0.2;
    }     

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
 
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
 
    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true); 

    scoreText = game.add.text(16, 16, 'score: 0', { font: '32px arial', fill: '#000' }); 

}

function update() {

    var playerMovingUpwards = player.deltaY < 0;
 
    //  Collide the player and the stars with the platforms

    if (!cursors.down.isDown && !playerMovingUpwards) {
       game.physics.collide(player, platforms); 
    }
    
    game.physics.collide(player, ground); 
    game.physics.collide(stars, platforms);
    game.physics.collide(stars, ground);
    game.physics.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
 
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
 
        player.animations.play('right');
    }
    else if (cursors.up.isDown ){
        // do nothing, keep increasing y velocity
    }
    else
    {
        //  Stand still
        player.animations.stop();
 
        player.frame = 4;

        if (playerMovingUpwards) {
            player.body.velocity.y = 0;
        }
    }
 
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && spacebarKey.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }    
 
}

function collectStar(player, star) {
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.content = 'Score: ' + score;
}