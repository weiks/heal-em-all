Q = Game.Q

# animations object
Q.animations "human",
  stand:
    frames: [4]
    rate: 1/2
  run:
    frames: [4, 5, 6]
    rate: 1/4
  hit:
    frames: [0]
    loop: false
    rate: 1/2
    next: "stand"
  jump:
    frames: [2]
    rate: 1/2

# human object and logic
Q.Sprite.extend "Human",
  init: (p) ->
    @_super p,
      x: 0
      y: 0
      vx: 0
      z: 20
      timeInvincible: 2
      sheet: "human"
      sprite: "human"
      type: Game.SPRITE_HUMAN
      collisionMask: Game.SPRITE_TILES
      sensor: true

    @add "2d, animation"

    # animations
    @play "stand"

    # events
    @on "sensor", @, "sensor"

  step: (dt) ->
    if @p.timeInvincible > 0
      @p.timeInvincible = Math.max(@p.timeInvincible - dt, 0)

  sensor: (obj) ->
    if obj.isA("Zombie") && @p.timeInvincible == 0
      # turn to zombie again
      @play("hit")

      @destroy()

      randomBool = Math.floor(Math.random() * 2)
      zombie = @stage.insert new Q.Zombie
        x: @p.x
        y: @p.y
        startLeft: randomBool

      zombie.p.wasHuman = true
