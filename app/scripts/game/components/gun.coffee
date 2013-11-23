Q = Game.Q

Q.component "gun",
  added: ->
    Q.input.on("fire", @entity, "fireGun")
    p = @entity.p

    p.noOfBullets = 12
    Q.state.set "bullets", p.noOfBullets

    # do not allow to fire in series
    p.nextFireTimeout = 0

  destroyed: ->
  	Q.input.off("fire", @entity)

  extend:
    gunStep: (dt) ->
      if @p.nextFireTimeout > 0
        @p.nextFireTimeout = Math.max(@p.nextFireTimeout - dt, 0)

    fireGun: ->
      if @p.nextFireTimeout == 0
        @p.nextFireTimeout = 0.5

        # fire
        @p.noOfBullets -= 1

        if @p.noOfBullets >= 0
          Q.state.set "bullets", @p.noOfBullets

        if @p.noOfBullets > 0

          if @p.direction == "left"
            delta = -35
          else
            delta = 35

          Q.AudioManager.add Game.audio.gunShot

          bullet = @stage.insert new Q.Bullet
            x: @p.x + delta
            y: @p.y + 12
            direction: @p.direction

        else
          Game.infoLabel.outOfBullets()

