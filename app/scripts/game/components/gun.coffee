Q = Game.Q

Q.component "gun",
  added: ->
    Q.input.on("fire", @entity, "fireGun")

  destroyed: ->
  	Q.input.off("fire", @entity)

  extend:
    fireGun: ->
      bullet = @stage.insert new Q.Bullet
        x: @p.x
        y: @p.y
        direction: @p.direction

