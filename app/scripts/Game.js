
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.computerBetSpeed = 100;
};

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        // this.add.tileSprite(0, 0, 480, 640, 'background');

        this.playerBet = this.createBet(this.world.centerX, 600);
        this.computerBet = this.createBet(this.world.centerX, 20);
        this.ball = this.createBall(this.world.centerX, this.world.centerY);

        // game input
        this.input.onDown.add(this.releaseBall, this);

        // experiment
        // this.spritesManager = new BasicGame.SpritesManager();
        // this.player = new BasicGame.Player({x: 10, y: 10});

        // this.spritesManager.add(this.player);



        // map
        var map = this.add.tilemap('map');
        var tileset = this.add.tileset('tiles');
        console.log(map, tileset);
        var layer = this.add.tilemapLayer(0, 0, 1024, 768, tileset, map, 0);
        layer.resizeWorld();

        this.player = new BasicGame.Player(this);
        this.camera.follow(this.player.sprite);

        this.cursors = this.input.keyboard.createCursorKeys();


    },

    update: function () {

        // this.spritesManager.updateAll()

        var playerBet = this.playerBet;
        var computerBet = this.computerBet;
        var ball = this.ball;

        //Control the player's racket
        playerBet.x = this.input.x;

        var playerBetHalfWidth = playerBet.width / 2;

        if (playerBet.x < playerBetHalfWidth) {
            playerBet.x = playerBetHalfWidth;
        } else if (playerBet.x > this.width - playerBetHalfWidth) {
            playerBet.x = this.width - playerBetHalfWidth;
        }

        //Control the computer's racket
        if(computerBet.x - ball.x < -15) {
            computerBet.body.velocity.x = this.computerBetSpeed;
        } else if(computerBet.x - ball.x > 15) {
            computerBet.body.velocity.x = -this.computerBetSpeed;
        } else {
            computerBet.body.velocity.x = 0;
        }

        //Check and process the collision ball and racket
        this.physics.collide(ball, playerBet, this.ballHitsBet, null, this);
        this.physics.collide(ball, computerBet, this.ballHitsBet, null, this);


        //
        this.player.update();
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.game.state.start('MainMenu');

    },

    createBet: function(x, y) {
        var bet = this.add.sprite(x, y, 'bet');
        bet.anchor.setTo(0.5, 0.5);
        bet.body.collideWorldBounds = true;
        bet.body.bounce.setTo(1, 1);
        bet.body.immovable = true;
        return bet;
    },

    createBall: function(x, y) {
        var ball = this.add.sprite(x, y, 'ball');
        ball.anchor.setTo(0.5, 0.5);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.setTo(1, 1);
        return ball;
    },

    ballReleased: false,
    ballSpeed: 300,
    releaseBall: function() {
        if (!this.ballReleased) {
            this.ball.body.velocity.x = this.ballSpeed;
            this.ball.body.velocity.y = -this.ballSpeed;
            this.ballReleased = true;
        }
    },

    ballHitsBet: function(_ball, _bet) {
        var diff = 0;

        if (_ball.x < _bet.x) {
            //If ball is in the left hand side on the racket
            diff = _bet.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        } else if (_ball.x > _bet.x) {
            //If ball is in the right hand side on the racket
            diff = _ball.x -_bet.x;
            _ball.body.velocity.x = (10 * diff);
        } else {
            //The ball hit the center of the racket, let's add a little bit of a tragic accident(random) of his movement
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }
    }

};
