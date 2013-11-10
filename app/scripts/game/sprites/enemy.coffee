Q = Game.Q

# animations object
Q.animations "enemy",
  run:
    frames: [4, 3, 2]
    rate: 1/4
  hit:
    frames: [0]
    loop: false
    rate: 1/2
    next: "run"

# enemy object and logic
Q.Sprite.extend "Enemy",
  init: (p) ->
    @_super p,
      lifePoints: 1
      x: 0
      y: 0
      vx: -100
      z: 10
      canSeeThePlayerTimeout: 0
      sheet: "zombie1"
      sprite: "enemy"
      type: Game.SPRITE_ENEMY
      collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER | Game.SPRITE_BULLET

    Q.state.inc "enemiesCounter", 1

    @add "2d, animation"

    # events
    @on "hit", @, "collision"
    @on "bump.right", @, "hitFromRight"
    @on "bump.left", @, "hitFromLeft"

    # animations
    @play("run")

  collision: (col) ->
    if col.obj.isA("Bullet")
      @play("hit")
      @decreaseLifePoints()

  hitFromRight: (col) ->
    # don't stop after collision
    @p.vx = col.impact

  hitFromLeft: (col) ->
    # don't stop after collision
    @p.vx = -col.impact

  step: (dt) ->
    # some AI - always try to catch player
    @canSeeThePlayer() # create @canSeeThePlayerObj object

    if @canSeeThePlayerObj.status
      # I see the player, I will remember that for X sec
      @p.canSeeThePlayerTimeout = 2

      if (@canSeeThePlayerObj.left and @p.vx > 0) or (@canSeeThePlayerObj.right and @p.vx < 0)
        # enemy goes in wrong direction, change it
        @p.vx = -@p.vx
    else
      # run timeout
      @p.canSeeThePlayerTimeout = Math.max(@p.canSeeThePlayerTimeout - dt, 0)

    # locate gap and turn back
    dirX = @p.vx/Math.abs(@p.vx)
    ground = Q.stage().locate(@p.x, @p.y + @p.h/2 + 1, Game.SPRITE_TILES)
    nextTile = Q.stage().locate(@p.x + dirX * @p.w/2 + dirX, @p.y + @p.h/2 + 1, Game.SPRITE_TILES)

    # if we are on ground and there is a cliff
    if(!nextTile and ground and !@canSeeThePlayerObj.status and @p.canSeeThePlayerTimeout == 0)
      @p.vx = -@p.vx

    # set the correct direction of sprite
    @flip()

  flip: ->
    if(@p.vx > 0)
      @p.flip = "x"
    else
      @p.flip = false

  decreaseLifePoints: ->
    @p.lifePoints -= 1

    if @p.lifePoints <= 0
      @destroy()

      # update enemies counter
      Q.state.dec "enemiesCounter", 1

  canSeeThePlayer: ->
    player = Game.player.p
    lineOfSight = 250

    @canSeeThePlayerObj = {}

    # is player on the same level as enemy?
    isTheSameY = player.y > @p.y - 10 and player.y < @p.y + 10

    # is player in the near of the enemy?
    @canSeeThePlayerObj.left = isCloseFromLeft = (player.x > @p.x - lineOfSight) and player.x < @p.x
    @canSeeThePlayerObj.right = isCloseFromRight = (player.x < @p.x + lineOfSight) and player.x > @p.x

    if isTheSameY and (isCloseFromLeft or isCloseFromRight)
      @canSeeThePlayerObj.status = true
    else
      @canSeeThePlayerObj.status = false

    return