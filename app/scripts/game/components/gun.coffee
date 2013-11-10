Q = Game.Q

Q.component "gun",
  added: ->
    Q.input.on("fire", @entity, "fireGun")

  extend:
    fireGun: ->
      bullet = @stage.insert new Q.Bullet
        x: @p.x
        y: @p.y
        direction: @p.direction

