
BasicGame.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function () {

        //  These are the assets we loaded in Boot.js
        //  A nice sparkly background and a loading progress bar
        // this.background = this.add.sprite(0, 0, 'preloaderBackground');
        // this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

        //  This sets the preloadBar sprite as a loader sprite, basically
        //  what that does is automatically crop the sprite from 0 to full-width
        //  as the files below are loaded in.
        // this.load.setPreloadSprite(this.preloadBar);

        //  Here we load most of the assets our game needs
        this.load.tilemap('map', 'data/map.tmx', null, Phaser.Tilemap.CSV);
        this.load.tileset('tiles', 'images/tiles.png', 70, 70, -1, 0, 0);

        this.load.image('player', 'images/player.png');
        this.load.image('bullet', 'images/bullet.png');

    },

    create: function () {

        //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while
        // this.preloadBar.cropEnabled = false;

        this.game.state.start('MainMenu');
    },

    update: function () {

        //  You don't actually need to do this, but I find it gives a much smoother game experience.
        //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //  You can jump right into the menu if you want and still play the music, but you'll have a few
        //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //  it's best to wait for it to decode here first, then carry on.
        
        //  If you don't have any music in your game then put the game.state.start line into the create function and delete
        //  the update function completely.
        
        // if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
        // {
        //  this.ready = false;
        //  this.game.state.start('MainMenu');
        // }

    }

};
