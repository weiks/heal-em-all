BasicGame.Bullet = function(game, player) {
    this.game = game;
    this.player = player;

    this.bullets = game.add.group();
    this.bullets.createMultiple(10, 'bullet');
    this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetBullet, this);

    //  Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    this.speed = 600;
    this.bulletTime = 0;
};

BasicGame.Bullet.prototype = {

    update: function() {

        this.game.physics.collide(this.bullets, this.game.layer, this.collisionHandler);

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.fireBullet();
        }
    },

    fireBullet: function() {

        if (this.game.time.now > this.bulletTime) {
            var bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(this.player.sprite.x, this.player.sprite.y-20);
                bullet.body.velocity.x = this.speed;
                this.bulletTime = this.game.time.now + 250;
            }
        }

    },

    resetBullet: function(bullet) {
        bullet.kill();
    },

    collisionHandler: function(a, b) {
        console.log(a, b);
    }

}
