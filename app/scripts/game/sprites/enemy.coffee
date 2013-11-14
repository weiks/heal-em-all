Q = Game.Q

# enemy object and logic
Q.Sprite.extend "Enemy",
  init: (p) ->
    @_super p,
      lifePoints: 1
      x: 0
      y: 0
      vx: 0
      z: 10
      canSeeThePlayerTimeout: 0
      type: Game.SPRITE_ENEMY
      collisionMask: Game.SPRITE_TILES | Game.SPRITE_PLAYER | Game.SPRITE_BULLET

    Q.state.inc "enemiesCounter", 1

    @add "2d, animation, zombieAI"

    # events
    @on "hit", @, "collision"
    @on "bump.right", @, "hitFromRight"
    @on "bump.left", @, "hitFromLeft"

  collision: (col) ->
    if col.obj.isA("Bullet")
      @play("hit")
      # @decreaseLifePoints()
      # @del "zombieAI"
      # @add "humanAI"

      @die()
      human = @stage.insert new Q.Player(x: @p.x, y: @p.y)
      human.del "platformerControls, gun"

  hitFromRight: (col) ->
    # don't stop after collision
    @p.vx = col.impact

  hitFromLeft: (col) ->
    # don't stop after collision
    @p.vx = -col.impact

  step: (dt) ->
    if @zombieStep?
      @zombieStep(dt)

    if @p.y > Game.map.p.h
      @die()

  decreaseLifePoints: ->
    @p.lifePoints -= 1

    if @p.lifePoints <= 0
      @die()

  die: ->
    @destroy()

    # update enemies counter
    Q.state.dec "enemiesCounter", 1

  