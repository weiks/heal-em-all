BasicGame.Player = function(game, params) {
    this.game = game;
    this.sprite = game.add.sprite(450, 80, 'player');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.jumpSpeed = 600;
    this.movingSpeed = 300;
};

BasicGame.Player.prototype = {

    update: function() {
        var cursors = this.game.cursors;

        this.sprite.body.gravity.y = 14;
        this.sprite.body.bounce.y = 0.1;
        this.sprite.body.velocity.x = 0;
        this.sprite.body.collideWorldBounds = true;

        if(cursors.up.isDown) {
            if(this.sprite.body.touching.down) {
                this.sprite.body.velocity.y = -this.jumpSpeed;
            }
        }

        if(cursors.left.isDown) {
            this.sprite.body.velocity.x = -this.movingSpeed;
            this.sprite.scale.x = -1;
        }
        else if(cursors.right.isDown) {
            this.sprite.body.velocity.x = this.movingSpeed;
            this.sprite.scale.x = 1;
        }

    }

}
