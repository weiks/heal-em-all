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
      sheet: "player"
      sprite: "human"
      type: Game.SPRITE_HUMAN
      collisionMask: Game.SPRITE_TILES | Game.SPRITE_ENEMY

    @add "2d, animation"

    # animations
    @play "stand"

    # events
    @on "hit", @, "collision"

  collision: (col) ->
    if col.obj.isA("Enemy")
      @play("hit")

      # turn to zombie again
      @destroy()
      random1to5 = Math.floor(Math.random() * 5) + 1
      randomBool = Math.floor(Math.random() * 2)
      @stage.insert new Q.Enemy
        x: @p.x
        y: @p.y
        sheet: "zombie" + random1to5
        startLeft: randomBool
