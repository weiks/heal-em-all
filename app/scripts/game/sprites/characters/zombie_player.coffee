Q = Game.Q

# animations object
Q.animations "zombiePlayer",
  stand:
    frames: [4]
    rate: 1
  run:
    frames: [4, 3, 2]
    rate: 1/4
  hit:
    frames: [0]
    loop: false
    rate: 1/2
    next: "run"
  jump:
    frames: [2]
    rate: 1/2

# main object and logic
Q.Sprite.extend "ZombiePlayer",
  init: (p) ->
    @_super p,
      timeToNextSave: 0
      x: 0
      y: 0
      z: 100
      savedPosition: {}
      sheet: "zombie5"
      sprite: "zombiePlayer"
      type: Game.SPRITE_ZOMBIE_PLAYER
      collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER_COLLECTIBLE

    @add("2d, platformerControls, animation")

    @p.jumpSpeed = -500
    @p.speed = 140
    @p.savedPosition.x = @p.x
    @p.savedPosition.y = @p.y

    # Q.state.set "lives", @p.lifePoints
    Game.infoLabel.zombieModeOnNext()

    # events
    @on "bump.left, bump.right, bump.bottom, bump.top", @, "collision"
    @on "player.outOfMap", @, "die"

  step: (dt) ->
    if @p.direction == "left"
      @p.flip = false
    if @p.direction == "right"
      @p.flip = "x"

    # check if out of map
    if @p.y > Game.map.p.h
      @trigger "player.outOfMap"

    # do not allow to get out of level
    if @p.x > Game.map.p.w
      @p.x = Game.map.p.w

    if @p.x < 0
      @p.x = 0

    # save
    if @p.timeToNextSave > 0
      @p.timeToNextSave = Math.max(@p.timeToNextSave - dt, 0)

    if @p.timeToNextSave == 0
      @savePosition()
      @p.timeToNextSave = 2

    # animations
    if @p.vy != 0
      @play("jump")
    else if @p.vx != 0
      @play("run")
    else
      @play("stand")

  collision: (col) ->
    # if col.obj.isA("Enemy")

  savePosition: ->
    dirX = @p.vx/Math.abs(@p.vx)
    ground = Q.stage().locate(@p.x, @p.y + @p.h/2 + 1, Game.SPRITE_TILES)

    if ground
      @p.savedPosition.x = @p.x
      @p.savedPosition.y = @p.y

  die: ->
    # zombie mode ends
    player = @stage.insert new Q.Player
      x: @p.savedPosition.x
      y: @p.savedPosition.y

    Game.setCameraTo(@stage, player)

    Game.infoLabel.zombieModeOff()

    @destroy()
