BasicGame.Player = function(game, params) {
	this.game = game;
	this.sprite = game.add.sprite(450, 80, 'ball');
    this.sprite.anchor.setTo(0.5, 0.5);
};

BasicGame.Player.prototype = {

    update: function() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.angularVelocity = 0;

        if (this.game.cursors.left.isDown)
        {
            this.sprite.body.angularVelocity = -200;
        }
        else if (this.game.cursors.right.isDown)
        {
            this.sprite.body.angularVelocity = 200;
        }

        if (this.game.cursors.up.isDown)
        {
            this.sprite.body.velocity.copyFrom(this.game.physics.velocityFromAngle(this.sprite.angle, 300));
        }
    }

}
