Q = Game.Q

Q.Sprite.extend "Gun",
  init: (p) ->
    @_super p,
      x: 0
      y: 0
      z: 10
      sheet: "gun"
      type: Game.SPRITE_PLAYER_COLLECTIBLE
      sensor: true

    # events
    @on "sensor", @, "sensor"

  sensor: (obj) ->
    if obj.isA("Player")
      Q.state.set "hasGun", true
      obj.add("gun")
      Game.infoLabel.gunFound()

      Q.AudioManager.add Game.audio.collected
      @destroy()


